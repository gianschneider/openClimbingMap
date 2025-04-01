import React, { useEffect, useRef, useState } from "react";
import "./BasemapPage.css";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import TileWMS from "ol/source/TileWMS.js";
import View from "ol/View.js";
import { Projection } from "ol/proj";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";
import Overlay from "ol/Overlay.js";
import Select from "ol/interaction/Select.js";
import { click } from "ol/events/condition.js";
import Style from "ol/style/Style";
import { Circle as CircleStyle, Fill, Stroke } from "ol/style";

function BasemapMap() {
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const popupContentRef = useRef(null);
  const popupCloserRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState("swisstopo");

  useEffect(() => {
    const extent = [2420000, 130000, 2900000, 1350000];

    const swisstopoLayer = new TileLayer({
      extent: extent,
      source: new TileWMS({
        url: "https://wms.geo.admin.ch/",
        crossOrigin: "anonymous",
        // attributions:
        //   '© <a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">geo.admin.ch</a>',
        projection: "EPSG:2056",
        params: {
          LAYERS: "ch.swisstopo.pixelkarte-farbe",
          FORMAT: "image/jpeg",
        },
        serverType: "mapserver",
      }),
    });

    const aerialLayer = new TileLayer({
      extent: extent,
      source: new TileWMS({
        url: "https://wms.geo.admin.ch/",
        crossOrigin: "anonymous",
        // attributions:
        //   '© <a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">geo.admin.ch</a>',
        projection: "EPSG:2056",
        params: {
          LAYERS: "ch.swisstopo.swissimage-product",
          FORMAT: "image/jpeg",
        },
        serverType: "mapserver",
      }),
      visible: false, //startet unsichtbar
    });

    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url: "http://10.175.7.65:8080/geoserver/GDI_openclimbingmap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GDI_openclimbingmap%3Aklettergebiete&maxFeatures=50&outputFormat=application%2Fjson",
      strategy: bboxStrategy,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          fill: new Fill({ color: "rgba(255, 255, 255, 0.6)" }),
          stroke: new Stroke({ color: "rgba(255, 0, 0, 0.6)", width: 2 }),
          radius: 5,
        }),
      }),
    });

    const map = new Map({
      layers: [swisstopoLayer, aerialLayer, vectorLayer],
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

  return (
    <div style={{ position: "relative", width: "200%", height: "50vh" }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>

      {/* Popup */}
      <div ref={popupRef} id="popup" className="ol-popup">
        <a ref={popupCloserRef} href="#" id="popup-closer" className="ol-popup-closer"></a>
        <div ref={popupContentRef} id="popup-content"></div>
      </div>

      {/* 3 Icons oben rechts */}
      {["🔍", "⚙️", "ℹ️"].map((icon, index) => (
        <div
          key={index}
          className="icon-container"
          style={{ top: `${10 + index * 50}px`, right: "10px" }}
        >
          {icon}
        </div>
      ))}

      {/* Button für Layer-Wechsel */}
      <div className="layer-switch-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        🗺️
      </div>

      {/* Layer-Auswahl-Menü */}
      {isMenuOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
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
        </div>
      )}
    </div>
  );
}

export default BasemapMap;
