import "./GeoTIFFPage.css";
import GeoTIFFMap from "./GeoTIFFMap.jsx";
import { useState } from "react";

function GeoTIFFPage() {
  const [opacity, setOpacity] = useState(0.5);
  return (
    <div id="geotiff-content">
      <label>
        Cloud-optimized GeoTIFF Opacity:
        <input
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={String(opacity)}
        />
      </label>
      <GeoTIFFMap opacity={opacity} />
    </div>
  );
}
export default GeoTIFFPage;
