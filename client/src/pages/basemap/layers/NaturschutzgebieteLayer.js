import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";
import Style from "ol/style/Style";
import { Fill, Stroke } from "ol/style";

export const createNaturschutzgebieteLayer = () => {
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: "http://10.175.7.65:8080/geoserver/GDI_openclimbingmap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GDI_openclimbingmap%3Anaturschutzgebiete&maxFeatures=50&outputFormat=application%2Fjson",
    strategy: bboxStrategy, // Lädt nur Features innerhalb der aktuellen Bounding-Box
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      fill: new Fill({
        color: "rgba(0, 255, 0, 0.4)", // Grüne Füllung mit Transparenz
      }),
      stroke: new Stroke({
        color: "rgba(0, 128, 0, 0.8)", // Dunkelgrüne Umrandung
        width: 2,
      }),
    }),
  });

  return vectorLayer;
};