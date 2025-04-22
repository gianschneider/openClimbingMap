import json

# Datei einlesen
input_file = r"c:\GDI\openClimbingMap\pp_suche\results\parkplätze_nodes.geojson"
output_file = r"c:\GDI\openClimbingMap\pp_suche\results\merged_parking_nodes.geojson"

with open(input_file, "r", encoding="utf-8") as file:
    data = json.load(file)

# Alle Elemente aus den "elements"-Listen zusammenführen
merged_elements = []
for item in data:
    if "elements" in item:
        merged_elements.extend(item["elements"])

# Neues JSON-Objekt erstellen
merged_data = {
    "type": "FeatureCollection",
    "elements": merged_elements
}

# Ergebnis in eine neue Datei schreiben
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(merged_data, file, ensure_ascii=False, indent=2)

print(f"Zusammengeführte Daten wurden in '{output_file}' gespeichert.")