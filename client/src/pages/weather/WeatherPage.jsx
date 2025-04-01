import React from "react";
import Weather from "./Weather";

function WeatherPage() {
  return (
    <div>
      <header>
        <h1>Wetterdaten</h1>
      </header>
      <main>
        <Weather />
      </main>
    </div>
  );
}

export default WeatherPage;
