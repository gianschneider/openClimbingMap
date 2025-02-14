import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cogProtocol } from "@geomatico/maplibre-cog-protocol";

function GeoTIFFMap({ opacity }) {
  const mapRef = useRef();

  // initialize map on first render
  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: "geotiff-map-container", // html container id
      style: "https://geoserveis.icgc.cat/contextmaps/icgc_mapa_base_gris_simplificat.json", //stylesheet location
      // style: "https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json", //stylesheet location
      center: [1.83369, 41.5937], // starting position
      // center: [7.642323, 47.534655], // starting position
      zoom: 15.5, // starting zoom
      // maxBounds: [
      //   [4, 43],
      //   [13, 50],
      // ],
    });
    maplibregl.addProtocol("cog", cogProtocol);
    mapRef.current.once("load", () => {
      mapRef.current.addSource("geotiff", {
        type: "raster",
        // url: "cog://https://data.geo.admin.ch/ch.swisstopo.pixelkarte-farbe-pk50.noscale/swiss-map-raster50_2023_213/swiss-map-raster50_2023_213_krel_2.5_2056.tif",
        url: "cog://https://labs.geomatico.es/maplibre-cog-protocol/data/image.tif",
        tileSize: 256,
      });
      mapRef.current.addLayer({
        id: "geotiff-layer",
        type: "raster",
        source: "geotiff",
        paint: { "raster-opacity": opacity },
      });
    });
  }, [opacity]);

  // update GeoTIFF opacity when it changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.getLayer("geotiff-layer")) {
      mapRef.current.setPaintProperty("geotiff-layer", "raster-opacity", opacity);
    }
  }, [opacity]);

  return <div id="geotiff-map-container" />;
}

export default GeoTIFFMap;
