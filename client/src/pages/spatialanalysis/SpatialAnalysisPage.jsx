import "./SpatialAnalysisPage.css";
import SpatialAnalysisMap from "./SpatialAnalysisMap.jsx";
import { useState } from "react";

function SpatialAnalysisPage() {
  const [bufferDistance, setBufferDistance] = useState(50);
  return (
    <div id="spatialanalysis-content">
      <label>
        Buffer distance around roads in meters:
        <input
          onChange={(e) => setBufferDistance(e.target.value)}
          type="number"
          value={bufferDistance}
        />
      </label>
      <SpatialAnalysisMap bufferDistance={bufferDistance} />
    </div>
  );
}
export default SpatialAnalysisPage;
