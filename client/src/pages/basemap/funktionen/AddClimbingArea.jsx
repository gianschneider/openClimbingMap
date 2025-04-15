import React, { useState } from "react";
import { Range } from "react-range";
import "../BasemapPage.css";

function AddClimbingArea({ mapRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [routes, setRoutes] = useState("");
  const [difficultyRange, setDifficultyRange] = useState([7, 14]); // Index für Schwierigkeit
  const [coordinates, setCoordinates] = useState(null);
  const [altitude, setAltitude] = useState("");
  const [type, setType] = useState("Sportklettern");

  const difficulties = [
    "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+",
    "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c",
  ];

  const handleSubmit = () => {
    console.log({
      name,
      routes,
      difficultyFrom: difficulties[difficultyRange[0]],
      difficultyTo: difficulties[difficultyRange[1]],
      coordinates,
      altitude,
      type,
    });
    alert("Klettergebiet hinzugefügt!");
    setIsOpen(false);
  };

  return (
    <>
      <img
        src="/erfassen-green.png"
        alt="Add Climbing Area"
        className="erfassen-button"
        onClick={() => setIsOpen((prevState) => !prevState)}
      />
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "60px", // Zentriert das Fenster bei einer Breite von 60%
            width: "60%", // Fenster nimmt 60% der Breite ein
            height: "auto", // Höhe passt sich dem Inhalt an
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 2000,
          }}
        >
          <h3 style={{ textAlign: "center" }}>Klettergebiet erfassen</h3>

          {/* Name */}
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ flex: "0 0 130px", textAlign: "left" }}>Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: 1, minWidth: "0" }}
            />
          </label>

          {/* Anzahl Routen */}
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ flex: "0 0 130px", textAlign: "left" }}>Anzahl Routen</span>
            <input
              type="number"
              value={routes}
              onChange={(e) => setRoutes(e.target.value)}
              style={{ flex: 1, minWidth: "0" }}
            />
          </label>

          {/* Höhe über Meer */}
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ flex: "0 0 130px", textAlign: "left" }}>Höhe über Meer</span>
            <input
              type="number"
              value={altitude}
              onChange={(e) => setAltitude(e.target.value)}
              style={{ flex: 1, minWidth: "0" }}
            />
          </label>

          {/* Schwierigkeit */}
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ flex: "0 0 130px", textAlign: "left" }}>Schwierigkeit</span>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <select
                value={difficulties[difficultyRange[0]]}
                onChange={(e) =>
                  setDifficultyRange([difficulties.indexOf(e.target.value), difficultyRange[1]])
                }
                style={{ flex: 1, marginRight: "10px" }}
              >
                {difficulties.map((difficulty, index) => (
                  <option key={index} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
              bis
              <select
                value={difficulties[difficultyRange[1]]}
                onChange={(e) =>
                  setDifficultyRange([difficultyRange[0], difficulties.indexOf(e.target.value)])
                }
                style={{ flex: 1, marginLeft: "10px" }}
              >
                {difficulties.map((difficulty, index) => (
                  <option key={index} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </label>

          {/* Disziplin */}
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ flex: "0 0 130px", textAlign: "left" }}>Disziplin</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ flex: 1, minWidth: "0" }}
            >
              <option value="Sportklettern">Sportklettern</option>
              <option value="Alpines Klettern">Alpinklettern</option>
            </select>
          </label>

          {/* Koordinaten */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <span style={{ flex: "0 0 130px", textAlign: "left" }}>Koordinaten</span>
              <input
                type="text"
                value={coordinates ? coordinates.join(", ") : ""}
                readOnly
                style={{ flex: 1, minWidth: "0", width: "100%" }}
              />
            </label>
            <button
              onClick={() => {
                const map = mapRef.current;
                if (map) {
                  map.once("click", (event) => {
                    const clickedCoordinates = map.getEventCoordinate(event);
                    setCoordinates(clickedCoordinates);
                  });
                  alert("Klicken Sie auf die Karte, um die Position auszuwählen.");
                }
              }}
              style={{ display: "block", marginLeft: "130px" }} // Einrücken unterhalb des Inputs
            >
              Auf Karte auswählen
            </button>
          </div>

          {/* Buttons */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={handleSubmit} style={{ marginRight: "10px" }}>
              Hinzufügen
            </button>
            <button onClick={() => setIsOpen(false)}>Abbrechen</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AddClimbingArea;