import { useEffect, useState } from "react";
import { Sun, CloudRain, Cloud, CloudSun, CloudSnow, Wind, CloudLightning, Snowflake } from "lucide-react";
import "./weather.css";

// Funktion zur Zuordnung der Icons basierend auf dem Pictocode
const getWeatherIcon = (pictocode) => {
  switch (pictocode) {
    case 1:
    case 2:
    case 3:
      return <Sun className="icon sun" />; // Klar, sonnig
    case 4:
    case 5:
    case 6:
    case 7:
      return <CloudSun className="icon cloud-sun" />; // Wechselnd bewölkt
    case 8:
    case 9:
    case 19:
    case 20:
    case 21:
      return <Cloud className="icon cloud" />; // Überwiegend bewölkt
    case 22:
      return <Cloud className="icon overcast" />; // Bedeckt
    case 23:
    case 25:
    case 33:
      return <CloudRain className="icon rain" />; // Regen
    case 24:
    case 26:
    case 34:
    case 35:
      return <CloudSnow className="icon snow" />; // Schneefall
    case 27:
    case 28:
    case 30:
      return <CloudLightning className="icon thunderstorm" />; // Gewitter
    case 29:
      return <Snowflake className="icon blizzard" />; // Schneesturm
    default:
      return <Wind className="icon wind" />; // Windig
  }
};

export default function Weather() {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedTime, setSelectedTime] = useState("09:00"); // Standardzeit: 09:00

  useEffect(() => {
    // Daten aus der JSON-Datei laden
    fetch("/src/pages/weather/Testabfrage_3h.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Laden der Wetterdaten");
        }
        return response.json();
      })
      .then((data) => {
        // Daten aus "data_3h" extrahieren und formatieren
        const times = ["09:00", "12:00", "15:00"];
        const formattedData = data.data_3h.time.reduce((acc, time, index) => {
          const date = time.split(" ")[0];
          const hour = time.split(" ")[1];
          if (times.includes(hour)) {
            if (!acc[date]) acc[date] = [];
            acc[date].push({
              time: hour,
              temp: Math.round(data.data_3h.temperature[index]), // Temperatur runden
              rain: Math.round(data.data_3h.precipitation[index]), // Niederschlag runden
              prob: Math.round(data.data_3h.precipitation_probability[index]), // Wahrscheinlichkeit runden
              icon: data.data_3h.pictocode[index], // Pictocode
            });
          }
          return acc;
        }, {});
        setWeatherData(Object.entries(formattedData));
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="weather-container">
      <div className="time-selector">
        {/* Zeit-Auswahl */}
        {["09:00", "12:00", "15:00"].map((time) => (
          <button
            key={time}
            className={`time-button ${selectedTime === time ? "active" : ""}`}
            onClick={() => setSelectedTime(time)}
          >
            {time}
          </button>
        ))}
      </div>
      <div className="weather-grid">
        {weatherData.map(([date, dayData], index) => {
          const dataForSelectedTime = dayData.find((d) => d.time === selectedTime);
          return (
            <div key={index} className="weather-card">
              <p className="date">{new Date(date).toLocaleDateString("de-DE", {
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}</p>
              {dataForSelectedTime ? (
                <>
                  {getWeatherIcon(dataForSelectedTime.icon)}
                  <p className="temp">{dataForSelectedTime.temp}°C</p>
                  <p className="rain">Regen: {dataForSelectedTime.rain} mm</p>
                  <p className="prob">Wahrscheinlichkeit: {dataForSelectedTime.prob}%</p>
                </>
              ) : (
                <p className="no-data">Keine Daten verfügbar</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
