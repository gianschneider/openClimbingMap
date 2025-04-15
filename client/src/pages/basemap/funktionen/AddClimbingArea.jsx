import React, { useState } from "react";
import { Range } from "react-range";

function AddClimbingArea({ mapRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [routes, setRoutes] = useState("");
  const [difficultyRange, setDifficultyRange] = useState([0, 0]); // Index für Schwierigkeit
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
        className="add-climbing-area-icon"
        onClick={() => setIsOpen(true)}
        style={{
          position: "absolute",
          top: "180px",
          right: "10px",
          zIndex: 1000,
          width: "40px",
          height: "40px",
          cursor: "pointer",
        }}
      />
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 2000,
          }}
        >
          <h3>Klettergebiet erfassen</h3>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />
          </label>
          <label>
            Anzahl Routen:
            <input
              type="number"
              value={routes}
              onChange={(e) => setRoutes(e.target.value)}
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />
          </label>
          <label>
            Schwierigkeit:
            <div style={{ marginBottom: "20px" }}>
              <Range
                step={1}
                min={0}
                max={difficulties.length - 1}
                values={difficultyRange}
                onChange={(values) => setDifficultyRange(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "6px",
                      width: "100%",
                      backgroundColor: "#ccc",
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props, index }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "20px",
                      width: "20px",
                      backgroundColor: "#999",
                      borderRadius: "50%",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "-25px",
                        color: "#000",
                        fontSize: "12px",
                      }}
                    >
                      {difficulties[difficultyRange[index]]}
                    </span>
                  </div>
                )}
              />
            </div>
          </label>
          <label>
            Koordinaten:
            <input
              type="text"
              value={coordinates ? coordinates.join(", ") : ""}
              readOnly
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
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
              style={{ marginBottom: "10px" }}
            >
              Auf Karte auswählen
            </button>
          </label>
          <label>
            Höhe über Meer:
            <input
              type="number"
              value={altitude}
              onChange={(e) => setAltitude(e.target.value)}
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            />
          </label>
          <label>
            Disziplin:
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ display: "block", marginBottom: "10px", width: "100%" }}
            >
              <option value="Sportklettern">Sportklettern</option>
              <option value="Alpines Klettern">Alpines Klettern</option>
            </select>
          </label>
          <button onClick={handleSubmit} style={{ marginRight: "10px" }}>
            Hinzufügen
          </button>
          <button onClick={() => setIsOpen(false)}>Abbrechen</button>
        </div>
      )}
    </>
  );
}

export default AddClimbingArea;