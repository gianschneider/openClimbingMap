import TileLayer from "ol/layer/Tile.js";
import TileWMS from "ol/source/TileWMS.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";

// Definiere das Kartenextens
const extent = [2420000, 130000, 2900000, 1350000];

//Geocover Layer

export const createGeocoverLayer = () => {
  return new VectorLayer({
    source: new VectorSource({
      format: new GeoJSON(),
      url: (extent) => `/api/geocover?bbox=${extent.join(",")}`,
      strategy: bboxstrategy, //lädt dateien nur für sichtbare bereiche
    }),
    visible: false, //startet unsichtbar
  });
};

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

// geocover
