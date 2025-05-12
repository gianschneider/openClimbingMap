import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";
import Style from "ol/style/Style";
import { Circle as CircleStyle, Fill, Stroke } from "ol/style";
import { getFilterParameters } from "../funktionen/filter-funktion"; // Importiere die Filterparameter

export const createKlettergebieteLayer = () => {
  // Hole die Filterparameter
  const filters = getFilterParameters();
  const { disciplines, minRoutes, maxRoutes, minAltitude, maxAltitude } = filters;

  // Basis-URL für den Geoserver
  let url = "http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne:Klettergebiete&outputFormat=application/json";

  // CQL_FILTER dynamisch erstellen
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

  // Füge den CQL_FILTER zur URL hinzu, falls vorhanden
  if (cqlFilter.length > 0) {
    url += `&CQL_FILTER=${cqlFilter.join(" AND ")}`;
  }

  console.log("Generierte URL mit CQL_FILTER:", url); // Debugging: Überprüfe die generierte URL

  // Erstelle die VectorSource mit der dynamischen URL
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: url,
    strategy: bboxStrategy,
  });

  // Erstelle den VectorLayer
  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      image: new CircleStyle({
        fill: new Fill({ color: "rgba(255, 255, 255, 0.6)" }),
        stroke: new Stroke({ color: "rgba(255, 0, 0, 0.6)", width: 2 }),
        radius: 5,
      }),
    }),
  });

  return vectorLayer;
};