import React, { useState, useEffect } from "react";
import "../BasemapPage.css";
import { swisstopoLayer } from "../layers/BackgroundLayers"; // Importiere den Swisstopo Layer
import { Map, View } from "ol";
import { fromLonLat, toLonLat, transform } from "ol/proj";

// CustomDropdown-Komponente
const CustomDropdown = ({ options, value, onChange, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative", flex: 1 }}>
      {/* Angezeigtes Feld */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          padding: "0px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: disabled ? "not-allowed" : "pointer",
          backgroundColor: disabled ? "#f9f9f9" : "white",
        }}
      >
        {value || placeholder}
      </div>

      {/* Dropdown-Liste (nur sichtbar wenn isOpen=true) */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            maxHeight: "90px", // 👈 Höhe für ~3 Einträge
            overflowY: "auto",
            border: "1px solid #ccc",
            backgroundColor: "white",
            zIndex: 1000,
          }}
        >
          {options.map((option, i) => (
            <div
              key={i}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              style={{
                padding: "8px",
                cursor: "pointer",
                backgroundColor: option === value ? "#f0f0f0" : "transparent",
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const fetchHeight = async (easting, northing) => {
  try {
    const response = await fetch(
      `https://api3.geo.admin.ch/rest/services/height?easting=${easting}&northing=${northing}`
    );
    const data = await response.json();
    return data.height; // Gibt die Höhe zurück
  } catch (error) {
    console.error("Fehler beim Abrufen der Höhe:", error);
    return null;
  }
};

function AddClimbingArea({ mapRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [routes, setRoutes] = useState("");
  const [difficultyRange, setDifficultyRange] = useState([null, null]);
  const [coordinates, setCoordinates] = useState(null);
  const [altitude, setAltitude] = useState("");
  const [type, setType] = useState("Sportklettern");
  const [existingNames, setExistingNames] = useState([]);
  const [error, setError] = useState("");
  const [errorRoutes, setErrorRoutes] = useState("");

  const difficulties = [
    "5a",
    "5a+",
    "5b",
    "5b+",
    "5c",
    "5c+",
    "6a",
    "6a+",
    "6b",
    "6b+",
    "6c",
    "6c+",
    "7a",
    "7a+",
    "7b",
    "7b+",
    "7c",
    "7c+",
    "8a",
    "8a+",
    "8b",
    "8b+",
    "8c",
    "8c+",
    "9a",
    "9a+",
    "9b",
    "9b+",
    "9c",
  ];

  useEffect(() => {
    fetch(
      "http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3AKlettergebiete&outputFormat=application%2Fjson"
    )
      .then((response) => response.json())
      .then((data) => {
        const names = data.features.map((feature) => feature.properties.Name);
        setExistingNames(names);
      })
      .catch((error) => console.error("Fehler beim Abrufen der Daten:", error));
  }, []);

  const handleNameChange = (e) => {
    const inputName = e.target.value;
    setName(inputName);

    if (existingNames.includes(inputName)) {
      setError("Dieser Name existiert bereits!");
    } else {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (error || errorRoutes || !coordinates) {
      alert("Bitte beheben Sie die Fehler, bevor Sie fortfahren.");
      return;
    }

    const klettergebiet = {
      Name: name, // Name des Klettergebiets
      X: parseFloat(coordinates[0]), // Easting
      Y: parseFloat(coordinates[1]), // Northing
      Hoehe: parseFloat(altitude), // Höhe über Meer
      Disziplin: type, // Disziplin (z. B. "Sportklettern")
      Routen: parseInt(routes), // Anzahl der Routen
      Schwierigkeit: `${difficulties[difficultyRange[0]]}-${difficulties[difficultyRange[1]]}`, // Schwierigkeit (z. B. "6a-7a")
    };

    console.log("Daten, die gesendet werden:", klettergebiet); // Debugging-Log

    try {
      const response = await fetch("http://localhost:8000/addKlettergebiet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(klettergebiet),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Erfolgsmeldung anzeigen
      } else {
        const errorData = await response.json();
        console.error("Fehler vom Backend:", errorData);
        alert(`Fehler: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Fehler beim Senden der Anfrage:", error);
      alert("Fehler beim Senden der Anfrage. Bitte überprüfen Sie die Verbindung.");
    }

    // Reset der Felder nach dem Speichern
    setName("");
    setRoutes("");
    setDifficultyRange([null, null]);
    setCoordinates(null);
    setAltitude("");
    setType("Sportklettern");
    setError("");
    setErrorRoutes("");
    setIsOpen(false);
  };

  return (
    <>
      <img
        src="/erfassen-green.png"
        alt="Add Climbing Area"
        className="erfassen-button"
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
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
          <h3 style={{ textAlign: "center" }}>Klettergebiet erfassen</h3>

          {/* Name */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <span style={{ flex: "0 0 130px", textAlign: "left" }}>Name</span>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                style={{
                  flex: 1,
                  minWidth: "0",
                }}
              />
            </label>
            {error && (
              <div style={{ marginLeft: "130px", color: "red", fontSize: "10px" }}>{error}</div>
            )}
          </div>

          {/* Anzahl Routen */}
          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
              <span style={{ flex: "0 0 130px", textAlign: "left" }}>Anzahl Routen</span>
              <input
                type="number"
                value={routes}
                onChange={(e) => {
                  const value = e.target.value;
                  setRoutes(value);
                  if (!value || parseInt(value) <= 0) {
                    setErrorRoutes("Die Anzahl der Routen muss größer als 0 sein!");
                  } else {
                    setErrorRoutes("");
                  }
                }}
                style={{
                  flex: 1,
                  minWidth: "0",
                }}
              />
            </label>
            {errorRoutes && (
              <div style={{ marginLeft: "130px", color: "red", fontSize: "10px" }}>
                {errorRoutes}
              </div>
            )}
          </div>

          {/* Schwierigkeit */}
          <label style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ flex: "0 0 130px", textAlign: "left" }}>Schwierigkeit</span>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "2px" }}>
              <CustomDropdown
                options={difficulties}
                value={difficultyRange[0] !== null ? difficulties[difficultyRange[0]] : ""}
                onChange={(val) => {
                  const newIndex = difficulties.indexOf(val);
                  setDifficultyRange([newIndex, difficultyRange[1]]);
                }}
                placeholder="von"
              />
              ➡️
              <CustomDropdown
                options={difficulties.slice(difficultyRange[0] !== null ? difficultyRange[0] : 0)}
                value={difficultyRange[1] !== null ? difficulties[difficultyRange[1]] : ""}
                onChange={(val) => {
                  const newIndex = difficulties.indexOf(val);
                  setDifficultyRange([difficultyRange[0], newIndex]);
                }}
                placeholder="bis"
                disabled={difficultyRange[0] === null}
              />
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
            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              {/* Button: Koordinaten von der Karte */}
              <button
                onClick={async () => {
                  if (mapRef && mapRef.current) {
                    const map = mapRef.current;

                    // Schließt das Fenster
                    setIsOpen(false);

                    // Aktiviert das Click-Event auf der Karte
                    const handleMapClick = async (event) => {
                      const coordinates = event.coordinate; // Koordinaten direkt im LV95-System (EPSG:2056)

                      // Übernimmt die Koordinaten in das Formular
                      const easting = coordinates[0].toFixed(2);
                      const northing = coordinates[1].toFixed(2);
                      setCoordinates([easting, northing]);

                      // Höhe abrufen und setzen
                      const height = await fetchHeight(easting, northing);
                      setAltitude(height);

                      // Entfernt den Event-Listener
                      map.un("click", handleMapClick);

                      // Öffnet das Fenster wieder
                      setTimeout(() => {
                        setIsOpen(true);
                      }, 100); // Kurze Verzögerung, um sicherzustellen, dass der Zustand korrekt aktualisiert wird
                    };

                    // Fügt den Click-Event-Listener hinzu
                    map.on("click", handleMapClick);
                  }
                }}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Koordinaten von Karte übernehmen
              </button>

              {/* Button: Eigene Position */}
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        const { latitude, longitude } = position.coords;

                        // WGS-Koordinaten (EPSG:4326) in LV95 (EPSG:2056) umwandeln
                        const lv95Coordinates = transform(
                          [longitude, latitude], // [Lon, Lat]
                          "EPSG:4326", // Ausgangskoordinatensystem
                          "EPSG:2056" // Zielkoordinatensystem
                        );

                        // Übernimmt die umgewandelten Koordinaten in das Formular
                        setCoordinates([
                          lv95Coordinates[0].toFixed(2),
                          lv95Coordinates[1].toFixed(2),
                        ]); // [Easting, Northing]

                        // Höhe abrufen und setzen
                        const height = await fetchHeight(
                          lv95Coordinates[0].toFixed(2),
                          lv95Coordinates[1].toFixed(2)
                        );
                        setAltitude(height);
                      },
                      (error) => {
                        console.error("Fehler beim Abrufen der Position:", error.message);
                      }
                    );
                  }
                }}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Eigene Position übernehmen
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={handleSubmit} style={{ marginRight: "10px" }}>
              Hinzufügen
            </button>
            <button onClick={() => setIsOpen(false)} style={{ marginRight: "10px" }}>
              Abbrechen
            </button>
            <button
              onClick={() => {
                // Setzt alle Felder auf ihre initialen Zustände zurück
                setName("");
                setRoutes("");
                setDifficultyRange([null, null]);
                setCoordinates(null);
                setAltitude("");
                setType("Sportklettern");
                setError("");
                setErrorRoutes("");
              }}
              style={{
                marginRight: "10px",
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Initialisiere die Karte
const map = new Map({
  target: "map", // ID des HTML-Elements, in dem die Karte gerendert wird
  layers: [
    swisstopoLayer, // Swisstopo Layer hinzufügen
  ],
  view: new View({
    center: fromLonLat([8.5417, 47.3769]), // Beispiel: Zürich
    zoom: 10,
  }),
});

export default AddClimbingArea;
