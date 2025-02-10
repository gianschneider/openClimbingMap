import "./SpatialAnalysisPage.css";
import { useState } from "react";
import SpatialAnalysisMap from "./SpatialAnalysisMap.jsx";
import FeatureTable from "../components/FeatureTable.jsx";

// load data
const kantone = await fetch("/kantone.geojson").then((res) => res.json());

function SpatialAnalysisPage() {
  const [selectedFeatureID, setSelectedFeatureID] = useState();
  return (
    <div id="spatialanalysis-content">
      <SpatialAnalysisMap
        featureCollection={kantone}
        selectedFeatureID={selectedFeatureID}
        setSelectedFeatureID={setSelectedFeatureID}
      />
      <FeatureTable
        features={kantone.features}
        selectedFeatureID={selectedFeatureID}
        setSelectedFeatureID={setSelectedFeatureID}
      />
    </div>
  );
}
export default SpatialAnalysisPage;
