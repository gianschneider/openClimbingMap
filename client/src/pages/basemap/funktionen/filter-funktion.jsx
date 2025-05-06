import React, { useState } from "react";

const FilterFunktion = ({ isFilterOpen, toggleFilter, applyFilter }) => {
  const [selectedDisciplines, setSelectedDisciplines] = useState({
    Sportklettern: true,
    AlpinesKlettern: true,
  });

  const [routeRange, setRouteRange] = useState([0, 50]); // Bereich für die Anzahl der Routen (min, max),
  const [altitudeRange, setAltitudeRange] = useState([200, 3000]); // Bereich für die Höhe über Meer (min, max)

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
    console.log("Anwenden-Button gedrückt"); // Debugging
    toggleFilter(); // Filterfenster schließen
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
          </div>

          {/* Filter anwenden */}
          <button
            onClick={handleApplyFilter}
            style={{
              marginTop: "20px", // Erhöhe den Abstand zum Slider
              padding: "10px 20px",
              backgroundColor: "#01940b",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Anwenden
          </button>
        </div>
      )}
    </>
  );
};

export default FilterFunktion;