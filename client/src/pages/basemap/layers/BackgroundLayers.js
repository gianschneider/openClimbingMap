import TileLayer from "ol/layer/Tile.js";
import TileWMS from "ol/source/TileWMS.js";

const extent = [2420000, 130000, 2900000, 1350000]; // Definiere das Kartenextens

// Swisstopo Layer
export const swisstopoLayer = new TileLayer({
  extent: extent,
  source: new TileWMS({
    url: "https://wms.geo.admin.ch/",
    crossOrigin: "anonymous",
    params: {
      LAYERS: "ch.swisstopo.pixelkarte-farbe",
      FORMAT: "image/jpeg",
    },
    serverType: "mapserver",
  }),
});

// Luftbild Layer
export const aerialLayer = new TileLayer({
  extent: extent,
  source: new TileWMS({
    url: "https://wms.geo.admin.ch/",
    crossOrigin: "anonymous",
    params: {
      LAYERS: "ch.swisstopo.swissimage-product",
      FORMAT: "image/jpeg",
    },
    serverType: "mapserver",
  }),
  visible: false, // Startet unsichtbar
});