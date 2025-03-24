import React from "react";
import BasemapMap from "./BasemapMap";

function BasemapPage() {
  return (
    <div>
      <header>
        <h1>Basemap Seite</h1>
      </header>
      <main>
        <BasemapMap />
      </main>
      <footer>
        <p>© 2025 OpenClimbingMap</p>
      </footer>
    </div>
  );
}

export default BasemapPage;
