import React, { useEffect } from "react";
import "./BasemapPage.css";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import TileWMS from "ol/source/TileWMS.js";
import View from "ol/View.js";
import { Projection } from "ol/proj";
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import {bbox as bboxStrategy} from 'ol/loadingstrategy.js';
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import { Circle as CircleStyle, Stroke } from "ol/style";



function BasemapMap() {
  useEffect(() => {
    const extent = [2420000, 130000, 2900000, 1350000];

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

    const map = new Map({
      layers: [swisstopoLayer, vector],
      target: "map",
      view: new View({
        center: [2600000, 1200000],
        zoom: 9,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });

    return () => {
      map.setTarget(null);
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      {/* Search Icon */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "white",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        }}
        onClick={() => alert("Search functionality not implemented yet!")}
      >
        🔍
      </div>
    </div>
  );
}

export default BasemapMap;
