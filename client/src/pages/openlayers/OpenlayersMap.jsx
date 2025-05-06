import { useState, useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import "ol/ol.css";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";

function OpenlayersMap({ featureCollection, selectedFeatureID, setSelectedFeatureID }) {
  const [featureLayer, setFeatureLayer] = useState();
  const [selectInteraction, setSelectInteraction] = useState();
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) return;

    const maxFlaeche = Math.max(
      ...featureCollection.features.map((f) => f.properties.kantonsflaeche)
    );
    const minFlaeche = Math.min(
      ...featureCollection.features.map((f) => f.properties.kantonsflaeche)
    );
    const colourScale = chroma.scale("Blues").domain([minFlaeche, maxFlaeche]);

    const geoJson = new GeoJSON();
    const kantone = geoJson.readFeatures(featureCollection, { featureProjection: "EPSG:3857" });
    kantone.forEach((f) => {
      f.setStyle(
        new Style({
          fill: new Fill({ color: colourScale(f.values_.kantonsflaeche).hex() }),
          stroke: new Stroke({ color: "lightgrey", width: 0.2 }),
        })
      );
    });

    const initFeatureLayer = new VectorLayer({ source: new VectorSource({ features: kantone }) });
    setFeatureLayer(initFeatureLayer);

    mapRef.current = new Map({
      target: "openlayers-container",
      layers: [initFeatureLayer],
      view: new View({
        projection: "EPSG:3857",
        center: [0, 0],
        zoom: 4,
        extent: [600_000, 5_650_000, 1_200_000, 6_150_000],
      }),
    });

    mapRef.current.getView().fit(initFeatureLayer.getSource().getExtent(), {
      padding: [20, 20, 20, 20],
      duration: 600,
    });

    const selectInteraction = new Select({
      condition: click,
      style: (feature) => {
        return new Style({
          fill: new Fill({
            color: colourScale(feature.values_.kantonsflaeche).hex(),
          }),
          stroke: new Stroke({ color: "cornflowerblue", width: 3 }),
          zIndex: 100,
        });
      },
    });

    selectInteraction.on("select", function (e) {
      if (e.selected.length) {
        setSelectedFeatureID(e.selected[0].getId());
      } else setSelectedFeatureID(undefined);
    });

    mapRef.current.addInteraction(selectInteraction);
    setSelectInteraction(selectInteraction);
  }, [featureCollection, setSelectedFeatureID]);

  useEffect(() => {
    if (selectInteraction && featureLayer) {
      selectInteraction.getFeatures().clear();
      const selectedFeature = featureLayer
        .getSource()
        .getFeatures()
        .filter((f) => f.getId() === selectedFeatureID)[0];
      if (selectedFeature) {
        selectInteraction.getFeatures().push(selectedFeature);
        mapRef.current.getView().fit(selectedFeature.getGeometry(), {
          padding: [100, 100, 100, 100],
          duration: 600,
        });
      } else if (featureCollection.features.length) {
        mapRef.current.getView().fit(featureLayer.getSource().getExtent(), {
          padding: [100, 100, 100, 100],
          duration: 600,
        });
      }
    }
  }, [selectInteraction, selectedFeatureID, featureLayer, featureCollection]);

  return <div id="openlayers-container" />;
}

export default OpenlayersMap;
