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
import { swisstopoLayer, aerialLayer } from "./layers/BackgroundLayers"; // Importiere die Hintergrundkarten
import { createKlettergebieteLayer } from "./layers/KlettergebieteLayer"; // Import the Klettergebiete layer
import { createNaturschutzgebieteLayer } from "./layers/NaturschutzgebieteLayer"; // Importiere den Naturschutzgebiete-Layer
import { handleNaturschutzgebieteToggle } from "./funktionen/layereinschalten"; // Importiere die Funktion
import SearchComponent from "./funktionen/search-funktion"; // Importiere die Suchfunktion

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

  useEffect(() => {
    // EPSG:2056 Definition hinzufügen
    proj4.defs(
      "EPSG:2056",
      "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k=1 +x_0=2600000 +y_0=1200000 +ellps=GRS80 +units=m +no_defs"
    );
    register(proj4);

    // Projektion registrieren
    const projection = getProjection("EPSG:2056");
    projection.setExtent([2420000, 1030000, 2900000, 1350000]);

    const klettergebieteLayer = createKlettergebieteLayer();
    const naturschutzgebieteLayerInstance = createNaturschutzgebieteLayer();
    setNaturschutzgebieteLayer(naturschutzgebieteLayerInstance); // Set the layer in state

    const map = new Map({
      layers: [swisstopoLayer, aerialLayer, naturschutzgebieteLayerInstance, klettergebieteLayer], // Add the layer here
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

    selectInteraction.on("select", (event) => {
      if (event.selected.length > 0) {
        const feature = event.selected[0];
        const properties = feature.getProperties();
        const content = Object.entries(properties)
          .filter(([key]) => !["geometry", "X", "Y"].includes(key))
          .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
          .join("<br>");
        popupContentRef.current.innerHTML = content;
        overlay.setPosition(feature.getGeometry().getCoordinates());
      } else {
        overlay.setPosition(undefined);
      }
    });

    popupCloserRef.current.onclick = () => {
      overlay.setPosition(undefined);
      return false;
    };

    // Function to switch layers
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

    // Attach the switchLayer function to the mapRef for use in the JSX
    mapRef.current.switchLayer = switchLayer;

    // Add pointermove event to change cursor when hovering over Klettergebiete
    map.on("pointermove", (event) => {
      const hit = map.hasFeatureAtPixel(event.pixel); // Check if a feature is under the cursor
      map.getTargetElement().style.cursor = hit ? "pointer" : ""; // Change cursor to pointer if hovering over a feature
    });

    return () => {
      map.setTarget(null);
    };
  }, []);
  ////
  //Funktion zum Zoomen auf Benutzerstandort
  const zoomToUserLocation = () => {
    if (!mapRef.current) return;
    //userkoordinaten herausfinden
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoordinates = [position.coords.longitude, position.coords.latitude];
        console.log("User location retrieved:", userCoordinates);

        //userkoordinaten transformieren
        const transformedCoordinates = transform(userCoordinates, "EPSG:4326", "EPSG:2056");
        console.log("Koordis transformiert:", transformedCoordinates);

        mapRef.current.getView().animate({
          center: transformedCoordinates,
          zoom: 14, // Optional: Passe den Zoom-Level an
          duration: 1000, // Animation in Millisekunden
        });
      },
      (error) => {
        console.error("Error getting user location:", error);
        alert("Unable to retrieve your location. Please check your device settings.");
      }
    );
  };

  return (
    <div style={{ position: "relative", width: "200%", height: "50vh" }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      {/*hier wird die Searchkomponente aufgerufen*/}
      <SearchComponent searchValue={searchValue} />

      {/* Popup */}
      <div ref={popupRef} id="popup" className="ol-popup">
        <a ref={popupCloserRef} href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div ref={popupContentRef} id="popup-content"></div>
      </div>
      {/*Button für Standort-Zoom */}
      <img
        src="/public/emlid-reachrs.png"
        alt="Standort"
        onClick={() => {
          // Hier wird die Funktion aufgerufen, wenn der Zoom-Button geklickt wird
          console.log("button clicked");
          zoomToUserLocation();
        }}
        style={{
          position: "absolute",
          bottom: "5px",
          left: "10px",
          zIndex: 1000,
          width: "40px",
          height: "40px",
          cursor: "pointer",
          backgroundColor: "white",
          borderRadius: "50%",
          padding: "10px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          opacity: 0.95,
          transition: "transform 0.3s ease, opacity 1s ease",
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
      {/* Button für Filtermenu */}
      <img
        src="/public/Filter.svg"
        alt="Standort"
        onClick={() => {
          // Hier wird die Funktion aufgerufen, wenn der Button geklickt wird
          console.log("button clicked");
        }}
        style={{
          position: "absolute",
          backgroundColor: "white",
          top: "10px",
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

      {/* Button für Suchmenu */}
      <div
        style={{
          position: "absolute",
          backgroundColor: "white",
          bottom: "10px",
          right: "10px",
          zIndex: 1000,
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
          src="/public/Suche.svg"
          alt="Standort"
          onClick={() => {
            // Hier wird die Funktion aufgerufen, wenn der Button geklickt wird
            console.log("button clicked");
          }}
          style={{
            position: "absolute",
            backgroundColor: "white",
            bottom: "10px",
            right: "260px",
            zIndex: 1000,
            width: "30px",
            height: "30px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        />
        {/*eingabefeld*/}
        <input
          type="text"
          placeholder="Gebietsname"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            padding: "10px",
            fontSize: "16px",
            flex: 1,
            marginLeft: "40px",
          }}
        ></input>
      </div>

      {/* Button für Information */}
      <img
        src="/public/info.svg"
        alt="Standort"
        onClick={() => {
          // Hier wird die Funktion aufgerufen, wenn der Button geklickt wird
          console.log("button clicked");
        }}
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
          backgroundColor: "white",
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

      {/* Button für Layer-Wechsel */}
      <img
        src="/public/layer.svg"
        alt="Standort"
        onClick={() => {
          // Hier wird die Funktion aufgerufen, wenn der Button geklickt wird
          console.log("button clicked");
          setIsMenuOpen(!isMenuOpen);
        }}
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
          backgroundColor: "white",
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
        </div>
      )}
    </div>
  );
}

export default BasemapMap;
