import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import Header from "./Header.jsx";
import BasemapPage from "./pages/basemap/BasemapPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/basemap" replace />} />
        <Route path="basemap" element={<BasemapPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);
