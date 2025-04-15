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
import { handleNaturschutzgebieteToggle } from "./funktionen/layereinschalten";
import { getWeatherDataForTwoDays, getWeatherIcon } from "../weather/Weather";
import SearchResults from "./funktionen/search-funktion";
import { Style, Fill, Stroke } from "ol/style";

function BasemapMap() {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const popupContentRef = useRef(null);
  const popupCloserRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState("swisstopo");
  const [naturschutzgebieteLayer, setNaturschutzgebieteLayer] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [isNaturschutzgebieteVisible, setIsNaturschutzgebieteVisible] = useState(false);
  const [isGeocoverVisible, setIsGeocoverVisible] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
    setNaturschutzgebieteLayer(naturschutzgebieteLayerInstance);

    const map = new Map({
      layers: [
        swisstopoLayer,
        aerialLayer,
        naturschutzgebieteLayerInstance,
        klettergebieteLayer,
        geocoverLayer,
      ],
      target: "map",
      view: new View({
        center: [2600000, 1200000],
        zoom: 9,
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

        console.log("Feature selected:", properties);

        try {
          const lonLat = transform(coordinates, "EPSG:2056", "EPSG:4326");
          const altitude = properties.hoehe || "N/A"; // Assuming 'hoehe' is a property in the feature

          // Wetterdaten abrufen mit lat, lon und asl
          const weatherData = await getWeatherDataForTwoDays(lonLat[1], lonLat[0], altitude);
          console.log("Weather data retrieved:", weatherData);

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
      } else if (layerName === "aerial") {
        swisstopoLayer.setVisible(false);
        aerialLayer.setVisible(true);
      }
      setActiveLayer(layerName);
      setIsMenuOpen(false);
    };

    mapRef.current.switchLayer = switchLayer;

    map.on("pointermove", (event) => {
      const hit = map.hasFeatureAtPixel(event.pixel);
      map.getTargetElement().style.cursor = hit ? "pointer" : "";
    });

    return () => {
      map.setTarget(null);
    };
  }, []);

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
      <div id="map" style={{ width: "100%", height: "100%" }}></div>

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
        src="/Filter.svg"
        alt="Filter"
        className="filter-button"
        onClick={() => console.log("button clicked")}
      />

      {/* Suchcontainer mit flex-col-reverse für die Anordnung */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
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
        onClick={() => console.log("button clicked")}
      />

      {/* Layer-Wechsel Button */}
      <img
        src="/layer.svg"
        alt="Layer"
        className="layer-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            right: "10px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          <div
            onClick={() => mapRef.current.switchLayer("swisstopo")}
            style={{
              padding: "5px",
              cursor: "pointer",
              backgroundColor: activeLayer === "swisstopo" ? "#f0f0f0" : "white",
            }}
          >
            Landeskarte
          </div>
          <div
            onClick={() => mapRef.current.switchLayer("aerial")}
            style={{
              padding: "5px",
              cursor: "pointer",
              backgroundColor: activeLayer === "aerial" ? "#f0f0f0" : "white",
            }}
          >
            Luftbild
          </div>
          <div style={{ marginTop: "10px" }}>
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
          <div style={{ marginTop: "10px" }}>
            <label>
              <input type="checkbox" checked={isGeocoverVisible} onChange={toggleGeocoverLayer} />
              Gesteinskarte
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasemapMap;
