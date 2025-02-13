import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import OpenlayersPage from "./pages/openlayers/OpenlayersPage.jsx";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import Header from "./Header.jsx";
import MaplibrePage from "./pages/maplibre/MaplibrePage.jsx";
import SpatialAnalysisPage from "./pages/spatialanalysis/SpatialAnalysisPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/openlayers" replace />} />
        <Route path="openlayers" element={<OpenlayersPage />} />
        <Route path="maplibre" element={<MaplibrePage />} />
        <Route path="spatialanalysis" element={<SpatialAnalysisPage />} />
        <Route path="cloudnative" element={<OpenlayersPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
