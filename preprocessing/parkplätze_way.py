import csv
import requests
import json
from pyproj import Transformer
from pathlib import Path

# Pfade
csv_file = r"c:\Users\Pascal\OneDrive - FHNW\VP-Geoinformation-und-Raumanalyse-Projekt\02_Grundlagedaten\Klettergebiete\Klettergebiete.csv"
output_dir = Path(r"c:\GDI\openClimbingMap\results")
output_dir.mkdir(parents=True, exist_ok=True)

# Overpass-API-Endpunkt
overpass_url = "http://overpass-api.de/api/interpreter"

# Transformer für LV95 -> WGS84 und zurück
transformer_to_wgs84 = Transformer.from_crs("EPSG:2056", "EPSG:4326", always_xy=True)
transformer_to_lv95 = Transformer.from_crs("EPSG:4326", "EPSG:2056", always_xy=True)

# Funktion zur Erstellung der Overpass-Abfrage
def create_query(lat, lon, radius, obj_type):
    return f"""
    [out:json];
    (
      {obj_type}["amenity"="parking"]["access"!="private"](around:{radius},{lat},{lon});
    );
    out body;
    >;
    out skel qt;
    """

# Ergebnisse speichern
def save_results(data, filename):
    with open(output_dir / filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# CSV-Datei lesen und Abfragen ausführen
def process_csv():
    nodes = []
    ways = []
    relations = []

    with open(csv_file, newline='', encoding='latin1') as csvfile:  # Zeichensatz geändert
        reader = csv.DictReader(csvfile)
        for row in reader:
            name = row["Name"]
            x = float(row["X"])
            y = float(row["Y"])

            # Koordinaten von LV95 nach WGS84 umrechnen
            lon, lat = transformer_to_wgs84.transform(x, y)

            # Overpass-Abfragen für Nodes, Ways und Relations erstellen
            for obj_type, result_list in [("node", nodes), ("way", ways), ("relation", relations)]:
                query = create_query(lat, lon, 1000, obj_type)
                response = requests.post(overpass_url, data={"data": query})
                if response.status_code == 200:
                    data = response.json()
                    result_list.append(data)
                else:
                    print(f"Fehler bei {name} ({obj_type}): {response.status_code}")

    # Ergebnisse speichern
    save_results(nodes, "parkplätze_nodes.geojson")
    save_results(ways, "parkplätze_ways.geojson")
    save_results(relations, "parkplätze_relations.geojson")

# Hauptfunktion
if __name__ == "__main__":
    process_csv()