import { useCallback, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import bbox from "@turf/bbox";

function MaplibreMap({ featureCollection, selectedFeatureID, setSelectedFeatureID }) {
  // create state ref that can be accessed in callbacks
  const mapRef = useRef();
  const prevSelectedFeatureID = useRef();
  const kantoneBbox = useRef();

  const handleSelectionChange = useCallback(
    (clickedFeature) => {
      // side effects: relies on module scoped refs
      // deselect previous feature
      if (prevSelectedFeatureID.current !== undefined) {
        mapRef.current.setFeatureState(
          { source: "kantone", id: prevSelectedFeatureID.current },
          { selected: false }
        );
      }
      if (clickedFeature) {
        // select feature
        setSelectedFeatureID(clickedFeature.id);
        prevSelectedFeatureID.current = clickedFeature.id;
        mapRef.current.setFeatureState(
          { source: "kantone", id: clickedFeature.id },
          { selected: true }
        );
        mapRef.current.fitBounds(bbox(clickedFeature), { essential: true, padding: 20 });
      } else {
        // no feature selected, zoom to data bounds
        prevSelectedFeatureID.current = undefined;
        setSelectedFeatureID(undefined);
        mapRef.current.fitBounds(kantoneBbox.current);
      }
    },
    [setSelectedFeatureID]
  );

  // initialize map on first render
  useEffect(() => {
    // if map already initialised, exit function
    if (mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: "maplibre-container", // html container id
      center: [0, 0], // starting position [lng, lat]. we'll zoom to data later
      zoom: 1, // starting zoom
      maxBounds: [
        [4, 43],
        [13, 50],
      ],
    });
    // add kantone
    const maxFlaeche = Math.max(
      ...featureCollection.features.map((f) => f.properties.kantonsflaeche)
    );
    const minFlaeche = Math.min(
      ...featureCollection.features.map((f) => f.properties.kantonsflaeche)
    );
    mapRef.current.addSource("kantone", { type: "geojson", data: featureCollection });
    mapRef.current.addLayer({
      id: "kantone",
      type: "fill",
      source: "kantone",
      paint: {
        "fill-color": [
          "interpolate-lab",
          ["linear"],
          ["get", "kantonsflaeche"],
          minFlaeche,
          "rgb(239,243,255)",
          maxFlaeche - minFlaeche,
          "#2171b5",
          maxFlaeche,
          "#08306B",
        ],
      },
    });
    mapRef.current.addLayer({
      id: "kantone-highlight",
      type: "line",
      source: "kantone",
      paint: {
        "line-color": "#2171b5",
        "line-width": 3,
        "line-opacity": ["case", ["boolean", ["feature-state", "selected"], false], 1, 0],
      },
    });
    // zoom to data
    kantoneBbox.current = bbox(featureCollection);
    mapRef.current.fitBounds(kantoneBbox.current);
    // add interaction, specify "click" instead of default "singleclick" because
    // the latter introduces 250ms delay to check for doubleclick
    mapRef.current.on("click", (e) => {
      console.log(e.lngLat);
      const clickedFeature = e.target.queryRenderedFeatures(e.point, { layer: "kantone" })[0];
      setSelectedFeatureID(clickedFeature?.id);
    });
    // Change the cursor to a pointer when the mouse is over the states layer.
    mapRef.current.on("mouseenter", "kantone", () => {
      mapRef.current.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    mapRef.current.on("mouseleave", "kantone", () => {
      mapRef.current.getCanvas().style.cursor = "";
    });
  }, [handleSelectionChange, featureCollection, selectedFeatureID]);

  // handle feature selection if selectedFeatureID changes
  useEffect(() => {
    // check for initialisation
    if (mapRef.current && featureCollection) {
      // get selected feature
      const selectedFeature = featureCollection.features.filter(
        (f) => f.id === selectedFeatureID
      )[0];
      handleSelectionChange(selectedFeature);
    }
  }, [handleSelectionChange, selectedFeatureID, featureCollection]);

  return <div id="maplibre-container" />;
}

export default MaplibreMap;
