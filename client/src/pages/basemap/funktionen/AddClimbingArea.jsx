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
        src="/erfassen-dot.svg"
        alt="Add Climbing Area"
        className="erfassen-button"
        onClick={() => setIsOpen((prevState) => !prevState)}
      />
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "25%",
            width: "50%", // Fenster nimmt 50% der Breite ein
            height: "80%", // Fenster nimmt 80% der Höhe ein
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 2000,
            overflowY: "auto", // Scrollbar, falls der Inhalt zu groß ist
          }}
        >
          <h3 style={{ textAlign: "center" }}>Klettergebiet erfassen</h3>
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ width: "150px", textAlign: "left" }}>Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: 1 }}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ width: "150px", textAlign: "left" }}>Anzahl Routen:</span>
            <input
              type="number"
              value={routes}
              onChange={(e) => setRoutes(e.target.value)}
              style={{ flex: 1 }}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ width: "150px", textAlign: "left" }}>Höhe über Meer:</span>
            <input
              type="number"
              value={altitude}
              onChange={(e) => setAltitude(e.target.value)}
              style={{ flex: 1 }}
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ width: "150px", textAlign: "left" }}>Disziplin:</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="Sportklettern">Sportklettern</option>
              <option value="Alpines Klettern">Alpinklettern</option>
            </select>
          </label>
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ width: "150px", textAlign: "left" }}>Koordinaten:</span>
            <input
              type="text"
              value={coordinates ? coordinates.join(", ") : ""}
              readOnly
              style={{ flex: 1 }}
            />
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
              style={{ marginLeft: "10px" }}
            >
              Auf Karte auswählen
            </button>
          </label>
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