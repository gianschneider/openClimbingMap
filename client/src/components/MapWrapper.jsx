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
import chroma from "chroma-js";

// load data and add styles for features
const kantoneRaw = await fetch("/kantone.geojson").then((res) => res.json());
const geoJsonFormat = new GeoJSON();
const kantone = geoJsonFormat.readFeatures(kantoneRaw, { featureProjection: "EPSG:3857" });
const maxFlaeche = Math.max(...kantone.map((f) => f.values_.kantonsflaeche));
const minFlaeche = Math.min(...kantone.map((f) => f.values_.kantonsflaeche));
const colourScale = chroma.scale("Blues").domain([minFlaeche, maxFlaeche]);
kantone.forEach((f) => {
  f.setStyle(new Style({ fill: new Fill({ color: colourScale(f.values_.kantonsflaeche).hex() }), stroke: new Stroke({ color: "lightgrey", width: 0.2 }) }));
});

function MapWrapper({ features, setFeatures, selectedFeatureID, setSelectedFeatureID }) {
  // set intial state
  const [featureLayer, setFeatureLayer] = useState();
  const [selectInteraction, setSelectInteraction] = useState();

  // create state ref that can be accessed in callbacks
  const mapRef = useRef();

  // initialize map on first render
  useEffect(() => {
    // if map already initialised, exit function
    if (mapRef.current) return;
    let initFeatureLayer = new VectorLayer({ source: new VectorSource({ features: kantone }) });
    setFeatureLayer(initFeatureLayer);
    setFeatures(kantone);
    mapRef.current = new Map({
      target: "map",
      layers: [initFeatureLayer],
      view: new View({
        projection: "EPSG:3857",
        center: [0, 0],
        zoom: 4,
        extent: [600_000, 5_650_000, 1_200_000, 6_150_000],
      }),
    });
    // zoom to data
    mapRef.current.getView().fit(initFeatureLayer.getSource().getExtent(), {
      padding: [20, 20, 20, 20],
      duration: 1000,
    });
    // add interaction, specify "click" instead of default "singleclick" because
    // the latter introduces 250ms delay to check for doubleclick
    const selectInteraction = new Select({
      condition: click,
      style: (feature) => {
        return new Style({
          fill: new Fill({
            color: colourScale(feature.values_.kantonsflaeche).hex(),
          }),
          stroke: new Stroke({ color: "cornflowerblue", width: 3 }),
        });
      },
    });
    selectInteraction.on("select", function (e) {
      if (e.selected.length) {
        console.log(`Selected feature: ${e.selected[0].getId()}, ${e.selected[0].get("name")}`);
        setSelectedFeatureID(e.selected[0].getId());
      } else setSelectedFeatureID();
    });
    mapRef.current.addInteraction(selectInteraction);
    setSelectInteraction(selectInteraction);
  }, [setFeatures, selectedFeatureID, setSelectedFeatureID]);

  // set selected feature on map
  useEffect(() => {
    // check for initialisation
    if (selectInteraction && featureLayer) {
      // clear selected features, otherwise it will add selected feature to existing ones
      // this should not be necessary since the "multi" property of the select interaction is false by default...
      selectInteraction.getFeatures().clear();
      // get selected feature
      const selectedFeature = featureLayer
        .getSource()
        .getFeatures()
        .filter((f) => f.getId() === selectedFeatureID)[0];
      if (selectedFeature) {
        selectInteraction.getFeatures().push(selectedFeature);
        mapRef.current.getView().fit(selectedFeature.getGeometry(), {
          padding: [100, 100, 100, 100],
          duration: 200,
        });
      } else if (features.length) {
        // preferably we would test this with featureLayer.getSource().state_ === "ready",
        // but this marks the source as ready before the features are fully loaded :S
        mapRef.current.getView().fit(featureLayer.getSource().getExtent(), {
          padding: [100, 100, 100, 100],
          duration: 200,
        });
      }
    }
  }, [selectInteraction, selectedFeatureID, featureLayer, features]);

  return (
    <div
      id="map"
      style={{ flex: "2 1 600px", margin: "1em", height: "70vh" }}
      className="map-container"
    ></div>
  );
}

export default MapWrapper;

/*
  // Tile Layers
  var osmsource = new OSM();
  var osmlayer = new TileLayer({
    source: osmsource
  })
  // Google Maps Terrain
  var tileLayerGoogle = new TileLayer({
    source: new XYZ({ url: 'http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}', })
  })
  //Laden des WMTS von geo.admin.ch > Hintergrungkarte in der Applikation
  var swisstopoWMTSLayer = 'ch.swisstopo.pixelkarte-grau'; // Swisstopo WMTS Layername

  var wmtsLayer = new TileLayer({
    //extent: extent,
    source: new TileWMS({
      url: 'https://wms.geo.admin.ch/',
      crossOrigin: 'anonymous',
      attributions: '© <a href="http://www.geo.admin.ch/internet/geoportal/' +
        'en/home.html">SWISSIMAGE / geo.admin.ch</a>',
      projection: 'EPSG:3857',
      params: {
        'LAYERS': swisstopoWMTSLayer,
        'FORMAT': 'image/jpeg'
      },
      // serverType: 'mapserver'
    })
  });
*/
