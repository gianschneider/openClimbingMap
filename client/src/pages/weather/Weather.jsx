import { useEffect, useState } from "react";
import "./weather.css";

// Funktion zur Zuordnung der Icons basierend auf dem Pictocode aus der CSV
export const getWeatherIcon = (pictocode) => {
  switch (pictocode) {
    case 1:
      return "☀️"; // Sonnig, wolkenloser Himmel
    case 2:
      return "🌤️"; // Sonnig mit einigen Wolken
    case 3:
      return "⛅"; // Wechselnd bewölkt
    case 4:
      return "☁️"; // Bedeckt
    case 5:
      return "🌫️"; // Nebel
    case 6:
      return "🌧️"; // Bedeckt mit Regen
    case 7:
      return "🌦️"; // Wechselhaft, Schauer möglich
    case 8:
      return "⛈️"; // Schauer, Gewitter möglich
    case 9:
      return "❄️"; // Bedeckt mit Schneefall
    case 10:
      return "🌨️"; // Wechselhaft mit Schneeschauern
    case 11:
      return "🌧️❄️"; // Überwiegend bewölkt mit Schnee und Regen
    case 12:
      return "🌦️"; // Bedeckt mit leichtem Regen
    case 13:
      return "🌨️"; // Bedeckt mit leichtem Schneefall
    case 14:
      return "🌧️"; // Überwiegend bewölkt mit Regen
    case 15:
      return "🌨️"; // Überwiegend bewölkt mit Schneefall
    case 16:
      return "🌦️"; // Überwiegend bewölkt mit leichtem Regen
    case 17:
      return "🌨️"; // Überwiegend bewölkt mit leichtem Schneefall
    default:
      return "❓"; // Unbekannt
  }
};

export const getWeatherDataForTwoDays = async (lat, lon, asl) => {
  try {
    // URL mit den übergebenen Werten erstellen
    const key = "ZCSK1YekVagxq5fN"; // API-Schlüssel
    const url = `https://my.meteoblue.com/packages/basic-day?apikey=${key}&lat=${lat}&lon=${lon}&asl=${asl}&format=json`;
    console.log(url); // Debugging: URL ausgeben
    // Daten abrufen
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Wetterdaten");
    }
    const data = await response.json();

    // Wetterdaten für die ersten beiden Tage extrahieren
    const days = data.data_day.time.slice(0, 2); // Heute und Morgen
    const temperatures = data.data_day.temperature_mean.slice(0, 2);
    const precipitations = data.data_day.precipitation.slice(0, 2);
    const pictocodes = data.data_day.pictocode.slice(0, 2);

    return days.map((day, index) => ({
      date: day,
      temperature: temperatures[index],
      precipitation: precipitations[index],
      pictocode: pictocodes[index],
    }));
  } catch (error) {
    console.error("Fehler beim Abrufen der Wetterdaten:", error);
    return null;
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
