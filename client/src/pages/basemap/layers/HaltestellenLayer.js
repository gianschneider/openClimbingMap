import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";
import Style from "ol/style/Style";
import { Circle as CircleStyle, Fill, Stroke } from "ol/style";

export const createHaltestelleLayer = () => {
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: "http://localhost:8080/geoserver/testuebung/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=testuebung%3Ahaltestellen_schweiz_gesamt&outputFormat=application%2Fjson",
    strategy: bboxStrategy,
  });

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new CircleStyle({
        fill: new Fill({ color: "rgba(255, 255, 255, 0.6)" }),
        stroke: new Stroke({ color: "rgba(250, 235, 20, 0.7)", width: 2 }),
        radius: 5,
      }),
    }),
  });

  return vectorLayer;
};