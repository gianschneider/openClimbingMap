import { useCallback, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import buffer from "@turf/buffer";

function SpatialAnalysisMap({ bufferDistance }) {
  // create state ref that can be accessed in callbacks
  const mapRef = useRef();
  // create reference for event handler so we can setup the event listener once in the
  // initial useEffet and update it later
  const updateRoadBuffers = useRef();
  const bufferCache = useRef(new Set());
  // callback to update road buffers
  updateRoadBuffers.current = useCallback(() => {
    if (!bufferDistance || bufferDistance === 0) return;
    console.log("Updating road buffers:", bufferDistance);
    // TODO: This function recalculates the buffers every time the viewport changes
    // This leads to many duplicate calculations. We could save a lot of effort by implementing some basic caching based on feature ID.
    let roads = mapRef.current.queryRenderedFeatures({ layers: ["road_fill"] });
    // filter roads that are not in cache
    // roads = roads.filter(
    //   (r) =>
    //     !bufferCache.current.has(
    //       r.geometry.coordinates.reduce((prev, curr) => prev + curr[0] + curr[1], 0)
    //     )
    // );
    // add new roads to cache
    // roads.forEach((r) =>
    //   // since feature have no ID, we use the sum of coordinates as a simple ID
    //   bufferCache.current.add(
    //     r.geometry.coordinates.reduce((prev, curr) => prev + curr[0] + curr[1], 0)
    //   )
    // );
    const roadsBuffers = roads.map((r) => buffer(r, bufferDistance, { units: "meters" }));
    // const oldRoadsBuffers = mapRef.current.querySourceFeatures("roadbuffers");
    mapRef.current.getSource("roadbuffers").setData({
      type: "FeatureCollection",
      features: roadsBuffers,
    });
  }, [bufferDistance]);

  // initialize map on first render
  useEffect(() => {
    // if map already initialised, exit function
    if (mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: "spatialanalysis-map-container", // html container id
      style: "https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json", //stylesheet location
      center: [7.642323, 47.534655], // starting position
      zoom: 15.5, // starting zoom
      maxBounds: [
        [4, 43],
        [13, 50],
      ],
    });
    // buffer roads on load and navigation
    mapRef.current.once("load", () => {
      mapRef.current.addSource("roadbuffers", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      mapRef.current.addLayer({
        id: "roadbuffers",
        // fill-extrusion because opacity is then rendered on a per layer, not per feature
        // basis, making it much faster and visually more appealing without us having to
        // merge the buffers
        type: "fill-extrusion",
        source: "roadbuffers",
        paint: { "fill-extrusion-color": "#08306B", "fill-extrusion-opacity": 0.5 },
      });
      updateRoadBuffers.current();
      // update buffers when viewport changes
      mapRef.current.on("moveend", () => updateRoadBuffers.current());
    });
  }, []);

  // update road buffers when buffer distance changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.getSource("roadbuffers")) updateRoadBuffers.current();
  }, [bufferDistance]);

  return <div id="spatialanalysis-map-container" />;
}

export default SpatialAnalysisMap;
