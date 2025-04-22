import React, { useEffect, useRef, useState } from "react";
import "./BasemapPage.css";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { Projection } from "ol/proj";
import { transform } from "ol/proj";
import Overlay from "ol/Overlay.js";
import Select from "ol/interaction/Select.js";
import { click } from "ol/events/condition.js";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { get as getProjection } from "ol/proj";
import { swisstopoLayer, aerialLayer, geocoverLayer } from "./layers/BackgroundLayers";
import { createKlettergebieteLayer } from "./layers/KlettergebieteLayer";
import { createNaturschutzgebieteLayer } from "./layers/NaturschutzgebieteLayer";
import { createHaltestelleLayer } from "./layers/HaltestellenLayer";
import { handleNaturschutzgebieteToggle } from "./funktionen/layereinschalten";
import { getWeatherDataForTwoDays, getWeatherIcon } from "../weather/Weather";
import SearchResults from "./funktionen/search-funktion";
import { Style, Fill, Stroke } from "ol/style";
import AddClimbingArea from "./funktionen/AddClimbingArea";

function BasemapMap() {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const popupContentRef = useRef(null);
  const popupCloserRef = useRef(null);
  const haltestelleLayerRef = useRef(null); // Ref für den Haltestellen-Layer
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState("swisstopo");
  const [naturschutzgebieteLayer, setNaturschutzgebieteLayer] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isNaturschutzgebieteVisible, setIsNaturschutzgebieteVisible] = useState(false);
  const [isGeocoverVisible, setIsGeocoverVisible] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isHaltestellenVisible, setIsHaltestellenVisible] = useState(false); // Sichtbarkeit der Haltestellen
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false); //  State für das Info-Menü
  const [isImpressumOpen, setIsImpressumOpen] = useState(false);
  const [isAddClimbingAreaOpen, setIsAddClimbingAreaOpen] = useState(false); // State für das Klettergebiet erfassen-Menü

  useEffect(() => {
    proj4.defs(
      "EPSG:2056",
      "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k=1 +x_0=2600000 +y_0=1200000 +ellps=GRS80 +units=m +no_defs"
    );
    register(proj4);

    const projection = getProjection("EPSG:2056");
    projection.setExtent([2420000, 1030000, 2900000, 1350000]);

    const klettergebieteLayer = createKlettergebieteLayer();
    const naturschutzgebieteLayerInstance = createNaturschutzgebieteLayer();
    const haltestelleLayer = createHaltestelleLayer(); // Haltestellen-Layer erstellen
    haltestelleLayer.setVisible(isHaltestellenVisible); // Initiale Sichtbarkeit setzen
    haltestelleLayerRef.current = haltestelleLayer; // Layer in Ref speichern
    setNaturschutzgebieteLayer(naturschutzgebieteLayerInstance);

    const map = new Map({
      layers: [
        swisstopoLayer,
        aerialLayer,
        naturschutzgebieteLayerInstance,
        geocoverLayer,
        haltestelleLayer, // Haltestellen-Layer hinzufügen
        klettergebieteLayer,
      ],
      target: "map",
      view: new View({
        center: [2600000, 1200000],
        zoom: 9,
        minZoom: 8, // Minimum zoom level
        maxZoom: 20, // Maximum zoom level
        extent: [2420000, 1030000, 2900000, 1350000],
        projection: new Projection({ code: "EPSG:2056", units: "m" }),
      }),
    });

    mapRef.current = map;

    const overlay = new Overlay({
      element: popupRef.current,
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });
    map.addOverlay(overlay);

    const selectInteraction = new Select({ condition: click });
    map.addInteraction(selectInteraction);

    selectInteraction.on("select", async (event) => {
      if (event.selected.length > 0) {
        const feature = event.selected[0];
        const properties = feature.getProperties();
        const coordinates = feature.getGeometry().getCoordinates();

        console.log("Feature properties:", properties); // Debug-Ausgabe

        // Layer anhand der Quelle unterscheiden
        if (klettergebieteLayer.getSource().hasFeature(feature)) {
          // Popup für Klettergebiete
          try {
            const lonLat = transform(coordinates, "EPSG:2056", "EPSG:4326");
            const altitude = properties.hoehe || "N/A";

            // Wetterdaten abrufen mit lat, lon und asl
            const weatherData = await getWeatherDataForTwoDays(lonLat[1], lonLat[0], altitude);

            const content = Object.entries(properties)
              .filter(([key]) => !["geometry", "X", "Y"].includes(key))
              .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
              .join("<br>");

            const weatherContent = weatherData
              ? weatherData
                  .map(
                    (day, index) => `
                    <div class="weather-section">
                      <strong>${index === 0 ? "Heute" : "Morgen"}:</strong><br>
                      <span class="weather-icon">${getWeatherIcon(day.pictocode)}</span><br>
                      Temperatur: ${Math.round(day.temperature)}°C<br>
                      Niederschlag: ${Math.round(day.precipitation)} mm
                    </div>`
                  )
                  .join("")
              : "<br><strong>Wetter:</strong> Daten nicht verfügbar";

            popupContentRef.current.innerHTML = content + weatherContent;
            overlay.setPosition(coordinates);
          } catch (error) {
            console.error("Error retrieving weather data:", error);
            popupContentRef.current.innerHTML =
              "<strong>Fehler beim Abrufen der Wetterdaten.</strong>";
            overlay.setPosition(coordinates);
          }
        } else if (haltestelleLayer.getSource().hasFeature(feature)) {
          // Popup für Haltestellen
          const properties = feature.getProperties();
          const cleanedProperties = Object.fromEntries(
            Object.entries(properties).map(([key, value]) => [key.trim().replace(/\uFEFF/g, ""), value])
          );

          // Zugriff auf den bereinigten Schlüssel
          const name = cleanedProperties["name"];
          popupContentRef.current.innerHTML = `
            <strong>${name || "Unbekannt"} (${properties.verkehrs_1 || "N/A"})</strong>`;
          overlay.setPosition(coordinates);
        } else {
          // Fallback für unbekannte Features
          popupContentRef.current.innerHTML = `<strong>Unbekanntes Feature</strong>`;
          overlay.setPosition(coordinates);
        }
      } else {
        overlay.setPosition(undefined);
      }
    });

    popupCloserRef.current.onclick = () => {
      overlay.setPosition(undefined);
      return false;
    };

    const switchLayer = (layerName) => {
      if (layerName === "swisstopo") {
        swisstopoLayer.setVisible(true);
        aerialLayer.setVisible(false);
        geocoverLayer.setVisible(false); // Deaktiviere geocoverLayer
      } else if (layerName === "aerial") {
        swisstopoLayer.setVisible(false);
        aerialLayer.setVisible(true);
        geocoverLayer.setVisible(false); // Deaktiviere geocoverLayer
      } else if (layerName === "geocover") {
        swisstopoLayer.setVisible(false);
        aerialLayer.setVisible(false);
        geocoverLayer.setVisible(true);
      }
      setActiveLayer(layerName); // Aktualisiere den aktiven Layer
      setIsMenuOpen(false); // Schließe das Menü nach dem Wechsel
    };

    mapRef.current.switchLayer = switchLayer;

    map.on("pointermove", (event) => {
      const hit = map.hasFeatureAtPixel(event.pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });

    return () => {
      map.setTarget(null);
    };
  }, [isHaltestellenVisible]); // Abhängigkeit hinzufügen, um Sichtbarkeit zu aktualisieren

  const zoomToUserLocation = () => {
    if (!mapRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoordinates = [position.coords.longitude, position.coords.latitude];
        console.log("User location retrieved:", userCoordinates);

        const transformedCoordinates = transform(userCoordinates, "EPSG:4326", "EPSG:2056");
        console.log("Koordis transformiert:", transformedCoordinates);

        mapRef.current.getView().animate({
          center: transformedCoordinates,
          zoom: 14,
          duration: 1000,
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert("Unable to retrieve your location. Please check your device settings.");
      }
    );
  };

  const toggleMenu = (menuName) => {
    setIsInfoMenuOpen(menuName === "info" ? !isInfoMenuOpen : false);
    setIsMenuOpen(menuName === "layer" ? !isMenuOpen : false);
    setIsImpressumOpen(menuName === "impressum" ? !isImpressumOpen : false);
    setIsAddClimbingAreaOpen(menuName === "addClimbingArea" ? !isAddClimbingAreaOpen : false);
  };

  const toggleGeocoverLayer = () => {
    if (geocoverLayer) {
      geocoverLayer.setVisible(!isGeocoverVisible);
      setIsGeocoverVisible(!isGeocoverVisible);
    }
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200);
  };

  return (
    <div style={{ position: "relative", width: "200%", height: "50vh" }}>
      <div id="map"></div>
      {/* Popup */}
      <div ref={popupRef} id="popup" className="ol-popup">
        <a ref={popupCloserRef} href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div ref={popupContentRef} id="popup-content"></div>
      </div>
      {/* Standort-Zoom Button */}
      <img
        src="/emlid-reachrs.png"
        alt="Standort"
        className="zoom-button"
        onClick={zoomToUserLocation}
      />
      {/* Filter Button */}
      <img
        src="/radar.jpg"
        alt="Filter"
        className="filter-button"
        onClick={() => console.log("button clicked")}
      />
      {/* Sport Climbing Logo */}
      <img
        src="./sportclimbing-pictogramm.png"
        alt="Sport Climbing Logo"
        className="basemap-logo"
      />
      {/* logo wand */}
      <img src="./logo-wand.png" alt="Logo Wand" className="basemap-logo-wand"></img>
      {/* logo climbing */}
      <AddClimbingArea
        mapRef={mapRef}
        onClick={() => toggleMenu("addClimbingArea")} // Öffnet oder schließt das Menü
      />
      {/* Suchcontainer mit flex-col-reverse für die Anordnung */}
      <div
        style={{
          position: "absolute",
          bottom: "-280px",
          right: "10px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column-reverse",
          gap: "5px",
        }}
      >
        {/* Suchfeld */}
        <div
          style={{
            backgroundColor: "white",
            width: "300px",
            height: "40px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            padding: "5px",
            transition: "transform 0.3s ease, opacity 1s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.opacity = "1.05";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(0.95)";
            e.target.style.opacity = "0.95";
          }}
        >
          <img
            src="/Suche.svg"
            alt="Suche"
            onClick={() => console.log("button clicked")}
            style={{
              bottom: "0px",
              width: "20px",
              height: "20px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          />
          <input
            type="text"
            placeholder="Gebietsname"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (e.target.value.length >= 1) {
                setShowSearchResults(true);
              } else {
                setShowSearchResults(false);
              }
            }}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            style={{
              border: "none",
              outline: "none",
              padding: "5px",
              fontSize: "16px",
              flex: 1,
            }}
          />
        </div>

        {/* Suchergebnisse (erscheint jetzt über dem Suchfeld) */}
        {showSearchResults && (
          <div className="search-results">
            <SearchResults
              searchValue={searchValue}
              onResultClick={(feature) => {
                const coordinates = feature.geometry.coordinates;
                mapRef.current.getView().animate({
                  center: coordinates,
                  zoom: 12,
                  duration: 1000,
                });
                setShowSearchResults(false);
              }}
            />
          </div>
        )}
      </div>
      {/* Info Button */}
      <img
        src="/info.svg"
        alt="Info"
        className="info-button"
        onClick={() => toggleMenu("info")} // Öffnet oder schließt das Info-Menü
        style={{
          position: "absolute",
          backgroundColor: "white",
          top: "70px",
          right: "10px",
          zIndex: 1000,
          width: "40px",
          height: "40px",
          cursor: "pointer",
          transition: "transform 0.3s ease, opacity 1s ease",
          borderRadius: "15%",
          padding: "5px",
        }}
      />
      {/* Info-Menü */}
      {isInfoMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "230px",
            right: "10px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "15px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            width: "300px",
          }}
        >
          <h3>Informationen</h3>
          <p>
            Die openClimbingMap hat 2 UseCases: Einerseits bestehende Gebiete zu finden und
            andererseit neue Gebiete zu erfassen! .
          </p>
          <p>
            Nutze die Buttons auf der rechten Seite um alle nötigen Einstellungen vorzunehmen.
            Weitere Informationen findest du auf der GitHubPage
          </p>
          <button
            onClick={() => setIsImpressumOpen(!isImpressumOpen)} // Öffnet oder schließt das Impressum-Dropdown
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Impressum
          </button>
          {isImpressumOpen && ( // Dropdown für das Impressum
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h4>openClimbingMap</h4>
              <p>
                Ein Projekt von Youssef Shamoun, Gian Schneider und Pascal Kalbermatten an der FHNW.
              </p>
              <p>GithubPage: temp.com</p>
              <p>Kontakt: gian.schneider@students.fhnw.ch</p>
            </div>
          )}
        </div>
      )}
      {/* Layer-Wechsel Button */}
      <img
        src="/layers.png"
        alt="Layer"
        className="layer-button"
        onClick={() => toggleMenu("layer")}
        style={{
          position: "absolute",
          backgroundColor: "white",
          top: "130px",
          right: "10px",
          zIndex: 1000,
          width: "40px",
          height: "40px",
          cursor: "pointer",
          transition: "transform 0.3s ease, opacity 1s ease",
          borderRadius: "15%",
          padding: "5px",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
          e.target.style.opacity = "1.1";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(0.9)";
          e.target.style.opacity = "0.9";
        }}
      />
      {/* Layer-Auswahl-Menü */}
      {isMenuOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "150px",
            right: "60px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row", // Bilder nebeneinander
              justifyContent: "space-around", // Platz zwischen den Bildern
              alignItems: "center",
              gap: "10px", // Abstand zwischen den Bildern
            }}
          >
            {/* Landeskarte */}
            <div
              onClick={() => mapRef.current.switchLayer("swisstopo")}
              style={{
                cursor: "pointer",
                backgroundColor: activeLayer === "swisstopo" ? "#f0f0f0" : "white",
                padding: "5px",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <img
                src="/rasterkarte.png"
                alt="rasterkarte"
                style={{ width: "80px", height: "40px" }} // Rechteckiges Seitenverhältnis
              />
              <span>Landeskarte</span>
            </div>

            {/* Luftbild */}
            <div
              onClick={() => mapRef.current.switchLayer("aerial")}
              style={{
                cursor: "pointer",
                backgroundColor: activeLayer === "aerial" ? "#f0f0f0" : "white",
                padding: "5px",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <img
                src="/luftbild.png"
                alt="luftbild"
                style={{ width: "80px", height: "40px" }} // Rechteckiges Seitenverhältnis
              />
              <span>Luftbild</span>
            </div>

            {/* Gesteinskarte */}
            <div
              onClick={() => mapRef.current.switchLayer("geocover")}
              style={{
                cursor: "pointer",
                backgroundColor: activeLayer === "geocover" ? "#f0f0f0" : "white",
                padding: "5px",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <img
                src="/gesteinskarte.png"
                alt="gesteinskarte"
                style={{ width: "80px", height: "40px" }} // Rechteckiges Seitenverhältnis
              />
              <span>Gesteinskarte</span>
            </div>
          </div>

          {/* Naturschutz */}
          <div style={{ marginTop: "10px", textAlign: "left" }}>
            <label>
              <input
                type="checkbox"
                checked={isNaturschutzgebieteVisible}
                onChange={() =>
                  handleNaturschutzgebieteToggle(
                    naturschutzgebieteLayer,
                    isNaturschutzgebieteVisible,
                    setIsNaturschutzgebieteVisible
                  )
                }
              />
              Naturschutzgebiete
            </label>
          </div>
          <div style={{ marginTop: "10px", textAlign: "left" }}>
            <label>
              <input
                type="checkbox"
                checked={isHaltestellenVisible}
                onChange={() => {
                  setIsHaltestellenVisible(!isHaltestellenVisible);
                  haltestelleLayerRef.current.setVisible(!isHaltestellenVisible); // Sichtbarkeit umschalten
                }}
              />
              Haltestellen
            </label>
          </div>
        </div>
      )}{" "}
    </div>
  );
}

export default BasemapMap;
