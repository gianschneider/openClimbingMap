import json
import folium
from pyproj import Transformer

# Datei einlesen
input_file = r"c:\GDI\openClimbingMap\pp_suche\results\merged_parking_nodes.geojson"
output_file = r"c:\GDI\openClimbingMap\pp_suche\results\converted_parking_nodes_lv95.geojson"
output_map = r"c:\GDI\openClimbingMap\pp_suche\results\parking_map_lv95.html"

# Transformer für die Koordinatenumwandlung (WGS84 -> LV95)
transformer = Transformer.from_crs("EPSG:4326", "EPSG:2056", always_xy=True)

with open(input_file, "r", encoding="utf-8") as file:
    data = json.load(file)

# Karte erstellen
map_center = [46.8, 8.3]  # Mittelpunkt der Karte (z.B. Schweiz)
mymap = folium.Map(location=map_center, zoom_start=8)

# Koordinaten konvertieren und Elemente auf der Karte darstellen
for element in data["elements"]:
    if element["type"] == "node":
        lon, lat = element["lon"], element["lat"]
        x, y = transformer.transform(lon, lat)  # WGS84 -> LV95
        element["x"] = x
        element["y"] = y

        # Marker mit konvertierten Koordinaten hinzufügen
        tags = element.get("tags", {})
        popup_text = f"LV95: ({x:.2f}, {y:.2f})<br>" + "<br>".join([f"{key}: {value}" for key, value in tags.items()])
        folium.Marker(location=[lat, lon], popup=popup_text).add_to(mymap)

# Konvertierte Daten in eine neue Datei schreiben
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

# Karte speichern
mymap.save(output_map)

print(f"Die konvertierten Daten wurden in '{output_file}' gespeichert.")
print(f"Die Karte wurde unter '{output_map}' gespeichert.")