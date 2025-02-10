import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import OpenlayersPage from "./pages/openlayers/OpenlayersPage.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Header from "./Header.jsx";
import MaplibrePage from "./pages/maplibre/MaplibrePage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/openlayers" replace />} />
        <Route path="openlayers" element={<OpenlayersPage />} />
        <Route path="maplibre" element={<MaplibrePage />} />
        <Route path="analysis" element={<OpenlayersPage />} />
        <Route path="cloudnative" element={<OpenlayersPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
