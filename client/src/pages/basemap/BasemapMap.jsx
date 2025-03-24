import React, { useEffect } from "react";
import "./BasemapPage.css";
import Map from "ol/Map.js";
import TileLayer from "ol/layer/Tile.js";
import TileWMS from "ol/source/TileWMS.js";
import View from "ol/View.js";
import { Projection } from "ol/proj";

function BasemapMap() {
  useEffect(() => {
    // Definition des Kartenextents für WMS/WMTS
    const extent = [2420000, 130000, 2900000, 1350000];

    // Laden des WMTS von geo.admin.ch > Hintergrundkarte in der Applikation
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

    // Initialisierung der Karte in der Applikation
    const map = new Map({
      layers: [swisstopoLayer],
      target: "map", // Verweis auf das HTML-Element mit der ID "map"
      view: new View({
        center: [2600000, 1200000],
        zoom: 9,
        projection: new Projection({
          code: "EPSG:2056",
          units: "m",
        }),
      }),
    });

    // Cleanup-Funktion, um die Karte beim Entfernen der Komponente zu zerstören
    return () => {
      map.setTarget(null);
    };
  }, []);

  return <div id="map" style={{ width: "100%", height: "100vh" }}></div>;
}

export default BasemapMap;
