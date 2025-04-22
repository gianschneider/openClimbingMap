import json
import csv

# Datei laden
geojson_file = r"c:\GDI\openClimbingMap\pp_suche\results\converted_parking_nodes_lv95.geojson"
csv_file = r"c:\GDI\openClimbingMap\pp_suche\results\converted_parking_nodes_lv95.csv"

with open(geojson_file, "r", encoding="utf-8") as f:
    data = json.load(f)

# CSV-Datei schreiben
with open(csv_file, "w", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["id", "lat", "lon", "x", "y", "tags"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    writer.writeheader()
    for element in data["elements"]:
        if element["type"] == "node":
            writer.writerow({
                "id": element.get("id"),
                "lat": element.get("lat"),
                "lon": element.get("lon"),
                "x": element.get("x"),
                "y": element.get("y"),
                "tags": json.dumps(element.get("tags", {}))  # Tags als JSON-String
            })

print(f"CSV-Datei wurde erstellt: {csv_file}")