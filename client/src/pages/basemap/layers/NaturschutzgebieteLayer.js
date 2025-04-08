import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";
import Style from "ol/style/Style";
import { Fill, Stroke } from "ol/style";

export const createNaturschutzgebieteLayer = () => {
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: "http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3AKlettergebiete&outputFormat=application%2Fjson",
    strategy: bboxStrategy, // Lädt nur Features innerhalb der aktuellen Bounding-Box
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    visible: false,
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