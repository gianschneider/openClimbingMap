import React, { useEffect, useState } from "react";
import "./BasemapPage.css";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import TileWMS from "ol/source/TileWMS.js";
import View from "ol/View.js";
import { Projection } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import { Circle as CircleStyle, Stroke } from "ol/style";
import { defaults as defaultControls, Zoom } from "ol/control";

function BasemapMap() {
  const [map, setMap] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); //menu status
  const [activeLayer, setActiveLayer] = useState("swisstopo"); //aktive karte
  useEffect(() => {
    const extent = [2420000, 130000, 2900000, 1350000];
    //swisstopo pixelkarte
    const swisstopoLayer = new TileLayer({
      extent: extent,
      source: new TileWMS({
        url: "https://wms.geo.admin.ch/",
        crossOrigin: "anonymous",
        attributions:
          '© <a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">geo.admin.ch</a>',
        projection: "EPSG:2056",
        params: {
          LAYERS: "ch.swisstopo.pixelkarte-farbe",
          FORMAT: "image/jpeg",
        },
        serverType: "mapserver",
      }),
    });

    //swisstopo Luftbild
    const aerialLayer = new TileLayer({
      extent: extent,
      source: new TileWMS({
        url: "https://wms.geo.admin.ch/",
        crossOrigin: "anonymous",
        attributions:
          '© <a href="http://www.geo.admin.ch/internet/geoportal/en/home.html">geo.admin.ch</a>',
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
      url: function (extent) {
        return (
          "http://localhost:8080/geoserver/ne/ows?service=WFS" +
          "&version=1.0.0&request=GetFeature&typeName=ne%3AKlettergebiete" +
          "&outputFormat=application%2Fjson"
        );
      },
      strategy: bboxStrategy,
      projection: "EPSG:2056",
    });

    const vector = new VectorLayer({
      source: vectorSource,
      properties: {
        name: "Klettergebiete",
      },
      style: (feature) => {
        return new Style({
          image: new CircleStyle({
            fill: new Fill({
              color: "rgba(255, 255, 255, 0.6)",
            }),
            stroke: new Stroke({
              color: "rgba(255, 0, 0, 0.6)",
              width: 2,
            }),
            radius: 5,
          }),
        });
      },
    });

    const mapInstance = new Map({
      layers: [swisstopoLayer, aerialLayer, vector],
      target: "map",
      view: new View({
        center: [2600000, 1200000],
        zoom: 9,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
      controls: defaultControls({
        zoom: false, // Standard-Zoom-Steuerung aktivieren
      }).extend([
        new Zoom({
          className: "custom-zoom", // Optional: Eigene Klasse für Styling
          target: null, // Standardmäßig im Kartencontainer
        }),
      ]),
    });

    setMap(mapInstance);

    return () => {
      mapInstance.setTarget(null);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchLayer = (layerName) => {
    if (map) {
      const layers = map.getLayers().getArray();
      const swisstopoLayer = layers[0];
      const aerialLayer = layers[1];

      if (layerName === "swisstopo") {
        swisstopoLayer.setVisible(true);
        aerialLayer.setVisible(false);
      } else if (layerName === "aerial") {
        swisstopoLayer.setVisible(false);
        aerialLayer.setVisible(true);
      }

      setActiveLayer(layerName);
      setIsMenuOpen(false); // Menü schließen
    }
  };

  return (
    <div style={{ position: "relative", width: "200%", height: "100vh" }}>
      {/* karten-container smartphone format */}
      <div
        id="map"
        style={{
          width: "100%",
          height: "60%",
          maxHeight: "100vh",
          margin: "0 auto",
          backgroundColor: "f0f0f0",
          position: "relative",
        }}
      >
        {/* Search Icon */}
        <button
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            backgroundColor: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={() => alert("Search functionality not implemented yet!")}
        >
          🔍
        </button>
        {/* Button zum öffnen Layermenu */}
        <button
          onClick={toggleMenu}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
          }}
        >
          {/* Layersymbol als SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: "20px", height: "20px", marginRight: "5px" }}
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </button>
        {/* Layermenü */}
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
              onClick={() => switchLayer("swisstopo")}
              style={{
                padding: "5px",
                cursor: "pointer",
                backgroundColor: activeLayer === "swisstopo" ? "#f0f0f0" : "white",
              }}
            >
              Landeskarte
            </div>
            <div
              onClick={() => switchLayer("aerial")}
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
    </div>
  );
}

export default BasemapMap;
