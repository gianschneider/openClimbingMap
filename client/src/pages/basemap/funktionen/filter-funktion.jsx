import React, { useState } from "react";

const FilterFunktion = ({ isFilterOpen, toggleFilter, applyFilter }) => {
  const [selectedDisciplines, setSelectedDisciplines] = useState({
    Sportklettern: true,
    AlpinesKlettern: true,
  });

  const [routeRange, setRouteRange] = useState([0, 100]); // Bereich für die Anzahl der Routen (min, max),
  const [altitudeRange, setAltitudeRange] = useState([200, 3000]); // Bereich für die Höhe über Meer (min, max)
  const difficulties = [
    "5a", "5a+", "5b", "5b+", "5c", "5c+", "6a", "6a+", "6b", "6b+", "6c", "6c+",
    "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+",
    "9a", "9a+", "9b", "9b+", "9c", "9c+",
  ];
  const [difficultyRange, setDifficultyRange] = useState([0, difficulties.length - 1]); // Bereich für die Schwierigkeitsgrade

  const handleCheckboxChange = (discipline) => {
    setSelectedDisciplines((prev) => ({
      ...prev,
      [discipline]: !prev[discipline],
    }));
  };

  const handleSliderChange = (e, index, rangeSetter, range) => {
    const newRange = [...range];
    newRange[index] = parseInt(e.target.value, 10);
    if (newRange[0] <= newRange[1]) {
      rangeSetter(newRange);
    }
  };

  const handleApplyFilter = () => {
    const disciplines = Object.keys(selectedDisciplines).filter(
      (discipline) => selectedDisciplines[discipline]
    );
    const minRoutes = routeRange[0];
    const maxRoutes = routeRange[1];
    const minAltitude = altitudeRange[0];
    const maxAltitude = altitudeRange[1];

    applyFilter({
      disciplines,
      minRoutes,
      maxRoutes,
      minAltitude,
      maxAltitude,
    });

    toggleFilter(); // Filterfenster schließen
  };

  const handleResetFilter = () => {
    setSelectedDisciplines({
      Sportklettern: true,
      AlpinesKlettern: true,
    });
    setRouteRange([0, 100]);
    setAltitudeRange([200, 3000]);
    setDifficultyRange([0, difficulties.length - 1]); // Optional, falls Schwierigkeit im GUI bleibt
  };

  return (
    <>
      {/* Filter-Button */}
      <img
        src="/radar.jpg"
        alt="Filter"
        className="filter-button"
        onClick={toggleFilter}
        style={{
          cursor: "pointer",
          width: "40px",
          height: "40px",
        }}
      />

      {/* Filter-Fenster */}
      {isFilterOpen && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "60px",
            width: "60%",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 2000,
          }}
        >
          <h3 style={{ textAlign: "center" }}>Filter</h3>

          <div>
            {/* Checkboxen für Disziplin */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ textAlign: "left", flex: 1 }}>Disziplin</span>
                <span style={{ textAlign: "right", flex: 1 }}>Sportklettern</span>
                <input
                  type="checkbox"
                  checked={selectedDisciplines.Sportklettern}
                  onChange={() => handleCheckboxChange("Sportklettern")}
                  style={{ marginLeft: "10px", width: "16px", height: "16px" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ textAlign: "left", flex: 1 }}></span>
                <span style={{ textAlign: "right", flex: 1 }}>Alpines Klettern</span>
                <input
                  type="checkbox"
                  checked={selectedDisciplines.AlpinesKlettern}
                  onChange={() => handleCheckboxChange("AlpinesKlettern")}
                  style={{ marginLeft: "10px", width: "16px", height: "16px" }}
                />
              </div>
            </div>

            {/* Titel für Anzahl Routen */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px" }}>
              <span style={{ textAlign: "left", flex: 1 }}>Anzahl Routen</span>
            </div>

            {/* Slider für Anzahl der Routen */}
            <div className="double_range_slider_box">
              <div className="double_range_slider">
                <div
                  className="range_track"
                  style={{
                    left: `${(routeRange[0] / 100) * 100}%`,
                    right: `${100 - (routeRange[1] / 100) * 100}%`,
                  }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={routeRange[0]}
                  onChange={(e) => handleSliderChange(e, 0, setRouteRange, routeRange)}
                  className="range_input"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={routeRange[1]}
                  onChange={(e) => handleSliderChange(e, 1, setRouteRange, routeRange)}
                  className="range_input"
                />
                <div
                  className="minvalue"
                  style={{
                    left: `${(routeRange[0] / 100) * 100}%`,
                  }}
                >
                  {routeRange[0]}
                </div>
                <div
                  className="maxvalue"
                  style={{
                    left: `${(routeRange[1] / 100) * 100}%`,
                  }}
                >
                  {routeRange[1]}
                </div>
              </div>
            </div>

            {/* Titel für Höhe über Meer */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px" }}>
              <span style={{ textAlign: "left", flex: 1 }}>Höhe über Meer</span>
            </div>

            {/* Slider für Höhe über Meer */}
            <div className="double_range_slider_box">
              <div className="double_range_slider">
                <div
                  className="range_track"
                  style={{
                    left: `${((altitudeRange[0] - 200) / (3000 - 200)) * 100}%`,
                    right: `${100 - ((altitudeRange[1] - 200) / (3000 - 200)) * 100}%`,
                  }}
                ></div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="100" // Schritte von 100 Metern
                  value={altitudeRange[0]}
                  onChange={(e) => handleSliderChange(e, 0, setAltitudeRange, altitudeRange)}
                  className="range_input"
                />
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="100" // Schritte von 100 Metern
                  value={altitudeRange[1]}
                  onChange={(e) => handleSliderChange(e, 1, setAltitudeRange, altitudeRange)}
                  className="range_input"
                />
                <div
                  className="minvalue"
                  style={{
                    left: `${((altitudeRange[0] - 200) / (3000 - 200)) * 100}%`,
                  }}
                >
                  {altitudeRange[0]}
                </div>
                <div
                  className="maxvalue"
                  style={{
                    left: `${((altitudeRange[1] - 200) / (3000 - 200)) * 100}%`,
                  }}
                >
                  {altitudeRange[1]}
                </div>
              </div>
            </div>

            {/* Titel für Schwierigkeit */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", marginBottom: "10px" }}>
              <span style={{ textAlign: "left", flex: 1 }}>Schwierigkeit</span>
            </div>

            {/* Slider für Schwierigkeit */}
            <div className="double_range_slider_box">
              <div className="double_range_slider">
                <div
                  className="range_track"
                  style={{
                    left: `${(difficultyRange[0] / (difficulties.length - 1)) * 100}%`,
                    right: `${100 - (difficultyRange[1] / (difficulties.length - 1)) * 100}%`,
                  }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max={difficulties.length - 1}
                  value={difficultyRange[0]}
                  onChange={(e) => handleSliderChange(e, 0, setDifficultyRange, difficultyRange)}
                  className="range_input"
                />
                <input
                  type="range"
                  min="0"
                  max={difficulties.length - 1}
                  value={difficultyRange[1]}
                  onChange={(e) => handleSliderChange(e, 1, setDifficultyRange, difficultyRange)}
                  className="range_input"
                />
                <div
                  className="minvalue"
                  style={{
                    left: `${(difficultyRange[0] / (difficulties.length - 1)) * 100}%`,
                  }}
                >
                  {difficulties[difficultyRange[0]]}
                </div>
                <div
                  className="maxvalue"
                  style={{
                    left: `${(difficultyRange[1] / (difficulties.length - 1)) * 100}%`,
                  }}
                >
                  {difficulties[difficultyRange[1]]}
                </div>
              </div>
            </div>
          </div>

          {/* Filter anwenden und Reset-Button */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button
              onClick={handleApplyFilter}
              style={{
                padding: "10px 20px",
                backgroundColor: "#01940b", // Grün
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "48%", // Gleiche Breite wie der Reset-Button
              }}
            >
              Anwenden
            </button>
            <button
              onClick={handleResetFilter}
              style={{
                padding: "10px 20px",
                backgroundColor: "rgb(0, 0, 0)", // Schwarz
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "48%", // Gleiche Breite wie der Anwenden-Button
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterFunktion;