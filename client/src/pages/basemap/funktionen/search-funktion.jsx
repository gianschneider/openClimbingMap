import React, { useEffect, useState } from "react";

function SearchResults({ searchValue, onResultClick, mapRef }) {
  const [geojsonData, setGeojsonData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/geoserver/ne/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ne%3AKlettergebiete&outputFormat=application%2Fjson")
      .then((response) => response.json())
      .then((json) => setGeojsonData(json.features))
      .catch((error) => console.error("Fehler beim Laden der GeoJSON-Daten:", error));
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredResults(geojsonData); // Zeige alle Klettergebiete an
    } else {
      const filtered = geojsonData.filter((feature) => {
        const name = feature.properties.Name?.toLowerCase() || "";
        return name.startsWith(searchValue.toLowerCase());
      });
      setFilteredResults(filtered);
    }
  }, [searchValue, geojsonData]);

  const handleFeatureClick = (feature) => {
    setSelectedFeatureId(feature.id);
    onResultClick(feature);
  };

  return (
    <div style={{
      position: "absolute",
      zIndex: 1000,
      backgroundColor: "white",
      marginBottom: "10px",
      maxHeight: "200px",
      overflowY: "auto",
      borderRadius: "10px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      bottom: "100%",
      left: "0",
      width: "100%"
    }}>
      {filteredResults.length >= 1 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {filteredResults.map((feature) => (
            <li
              key={feature.id}
              onClick={() => handleFeatureClick(feature)}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                backgroundColor: feature.id === selectedFeatureId ? "#fffacd" : "white",
                fontWeight: feature.id === selectedFeatureId ? "bold" : "normal",
                transition: "all 0.2s ease",
              }}
            >
              {feature.properties.Name}
              {feature.id === selectedFeatureId && (
                <span style={{ 
                  color: "#ffd700",
                  marginLeft: "8px",
                  fontSize: "0.8em"
                }}>
                  ✓
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        searchValue.length >= 1 && (
          <div style={{ padding: "8px 12px", color: "#777", whiteSpace: "nowrap" }}>
            Keine Ergebnisse gefunden
          </div>
        )
      )}
    </div>
  );
}

export default SearchResults;