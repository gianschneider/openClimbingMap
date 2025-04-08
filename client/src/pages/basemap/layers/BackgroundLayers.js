import TileLayer from "ol/layer/Tile.js";
import TileWMS from "ol/source/TileWMS.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy";

// Definiere das Kartenextens
const extent = [2420000, 130000, 2900000, 1350000];

//Geocover Layer

export const GeocoverLayer = () => {
  return new VectorLayer({
    source: new VectorSource({
      format: new GeoJSON(),
      url: (extent) =>
        `https://api3.geo.admin.ch/rest/services/api/MapServer/ch.swisstopo.geologie-geocover/query?geometry=${extent.join(
          ","
        )}&geometryType=esriGeometryEnvelope&inSR=2056&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=true&f=geojson`,
      strategy: bboxStrategy, // Lädt Daten nur für sichtbare Bereiche
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
