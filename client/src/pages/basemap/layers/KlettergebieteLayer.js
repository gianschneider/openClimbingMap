import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Cluster from "ol/source/Cluster.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";
import Style from "ol/style/Style";
import { Circle as CircleStyle, Fill, Stroke, Text } from "ol/style";
import { getFilterParameters } from "../funktionen/filter-funktion";

export const createKlettergebieteLayer = () => {
  const filters = getFilterParameters();
  const { disciplines, minRoutes, maxRoutes, minAltitude, maxAltitude } = filters;

  let url = "http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne:Klettergebiete&outputFormat=application/json";
  let cqlFilter = [];
  if (disciplines && disciplines.length > 0) {
    const disciplineFilter = disciplines.map((d) => `Disziplin='${d}'`).join(" OR ");
    cqlFilter.push(`(${disciplineFilter})`);
  }
  if (minRoutes !== undefined && maxRoutes !== undefined) {
    cqlFilter.push(`Routen BETWEEN ${minRoutes} AND ${maxRoutes}`);
  }
  if (minAltitude !== undefined && maxAltitude !== undefined) {
    cqlFilter.push(`Hoehe BETWEEN ${minAltitude} AND ${maxAltitude}`);
  }
  if (cqlFilter.length > 0) {
    url += `&CQL_FILTER=${cqlFilter.join(" AND ")}`;
  }

  // 1. Erstelle die VectorSource wie bisher
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: url,
    strategy: bboxStrategy,
  });

  // 2. Erstelle eine ClusterSource
  const clusterSource = new Cluster({
    distance: 40, // Pixel-Abstand für das Clustering, ggf. anpassen
    source: vectorSource,
  });

  // 3. Style für Cluster und Einzelpunkte
  const clusterStyle = function (feature) {
    const size = feature.get("features").length;
    if (size > 1) {
      return new Style({
        image: new CircleStyle({
          radius: 15 + Math.min(size, 20), // Größere Kreise für größere Cluster
          fill: new Fill({ color: "rgba(255, 0, 0, 0.4)" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({ color: "#fff" }),
          stroke: new Stroke({ color: "#000", width: 3 }),
          font: "bold 14px Arial",
        }),
      });
    } else {
      return new Style({
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({ color: "rgba(255, 255, 255, 0.6)" }),
          stroke: new Stroke({ color: "rgba(255, 0, 0, 0.6)", width: 2 }),
        }),
      });
    }
  };

  // 4. Erstelle den VectorLayer mit ClusterSource
  const vectorLayer = new VectorLayer({
    source: clusterSource,
    style: clusterStyle,
  });

  return vectorLayer;
};