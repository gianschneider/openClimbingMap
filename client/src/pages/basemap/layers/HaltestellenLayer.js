import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import GeoJSON from "ol/format/GeoJSON.js";
import { bbox as bboxStrategy } from "ol/loadingstrategy.js";
import Style from "ol/style/Style";
import { Icon } from "ol/style";

export const createHaltestelleLayer = () => {
  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: "http://localhost:8000/haltestellen",
    strategy: bboxStrategy,
  });

  // Style-Funktion, die je nach Titel entscheidet, welches Icon verwendet wird
  const haltestelleStyle = function (feature) {
    // Feature-Eigenschaften abrufen
    const title = feature.get("title") || ""; // Titel des Features oder leerer String wenn nicht vorhanden

    // Das richtige Icon basierend auf dem Titel wählen
    let iconSrc = "/bus.jpeg"; // Standard: Bus-Icon

    // Wenn der Titel "Zug" enthält, Zug-Icon verwenden
    if (
      title.toLowerCase().includes("zug") ||
      title.toLowerCase().includes("train") ||
      title.toLowerCase().includes("bahnhof") ||
      title.toLowerCase().includes("station")
    ) {
      iconSrc = "/zug.jpeg";
    }

    return new Style({
      image: new Icon({
        src: iconSrc,
        scale: 0.1, // Auf 0.25 reduziert (halbe Größe des ursprünglichen Werts 0.5)
        anchor: [0.5, 0.5], // Ankerpunkt in der Mitte des Icons
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
      }),
    });
  };

  const vectorLayer = new VectorLayer({
    source: vectorSource,
    style: haltestelleStyle, // Stil-Funktion zuweisen
  });

  return vectorLayer;
};
