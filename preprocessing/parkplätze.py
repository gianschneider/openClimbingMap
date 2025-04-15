import pandas as pd
import pyproj
import overpy
import time

# ==== EINSTELLUNGEN ====
INPUT_CSV = "C:/Users/Pascal/OneDrive - FHNW/VP-Geoinformation-und-Raumanalyse-Projekt/02_Grundlagedaten/Klettergebiete/Klettergebiete.csv"
OUTPUT_CSV = "C:/Users/Pascal/OneDrive - FHNW/VP-Geoinformation-und-Raumanalyse-Projekt/02_Grundlagedaten/Klettergebiete/Parkplätze_gefunden_1200.csv"

RADIUS = 1200  # in Metern
ENCODING = "ISO-8859-1"  # ggf. anpassen

# ==== 1. CSV einlesen ====
df = pd.read_csv(INPUT_CSV, encoding=ENCODING)

# ==== 2. LV95 → WGS84 umrechnen ====
transformer = pyproj.Transformer.from_crs("EPSG:2056", "EPSG:4326", always_xy=True)
df["lon"], df["lat"] = transformer.transform(df["X"].values, df["Y"].values)

# Nur eindeutige Koordinaten (Klettergebiete)
df_unique = df[["lat", "lon"]].drop_duplicates().reset_index(drop=True)

# ==== 3. Overpass API initialisieren ====
api = overpy.Overpass()
results = []
seen_ids = set()

# ==== 4. Parkplatzsuche ====
for idx, row in df_unique.iterrows():
    lat, lon = row["lat"], row["lon"]
    print(f"🔍 {idx + 1}/{len(df_unique)}: Suche bei ({lat:.5f}, {lon:.5f})...")

    query = f"""
    (
      node["amenity"="parking"]["access"!~"private"](around:{RADIUS},{lat},{lon});
      way["amenity"="parking"]["access"!~"private"](around:{RADIUS},{lat},{lon});
      relation["amenity"="parking"]["access"!~"private"](around:{RADIUS},{lat},{lon});
    );
    out center;
    """

    try:
        response = api.query(query)

        for node in response.nodes:
            uid = f"node_{node.id}"
            if uid not in seen_ids:
                results.append({
                    "type": "node",
                    "id": node.id,
                    "lat": node.lat,
                    "lon": node.lon,
                    "source_lat": lat,
                    "source_lon": lon
                })
                seen_ids.add(uid)

        for way in response.ways:
            center = way.get_center()
            uid = f"way_{way.id}"
            if center and uid not in seen_ids:
                results.append({
                    "type": "way",
                    "id": way.id,
                    "lat": center.lat,
                    "lon": center.lon,
                    "source_lat": lat,
                    "source_lon": lon
                })
                seen_ids.add(uid)

        for rel in response.relations:
            center = rel.get_center()
            uid = f"rel_{rel.id}"
            if center and uid not in seen_ids:
                results.append({
                    "type": "relation",
                    "id": rel.id,
                    "lat": center.lat,
                    "lon": center.lon,
                    "source_lat": lat,
                    "source_lon": lon
                })
                seen_ids.add(uid)

        time.sleep(1)

    except Exception as e:
        print(f"⚠️ Fehler bei Punkt {idx + 1}: {e}")
        time.sleep(5)

# ==== 5. Ergebnisse speichern ====
results_df = pd.DataFrame(results)
results_df.to_csv(OUTPUT_CSV, index=False)
print(f"✅ Fertig! {len(results_df)} Parkplätze gespeichert in '{OUTPUT_CSV}'")


import json

# GeoJSON erzeugen
geojson = {
    "type": "FeatureCollection",
    "features": []
}

for _, row in results_df.iterrows():
    feature = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [row["lon"], row["lat"]],
        },
        "properties": {
            "id": row["id"],
            "osm_type": row["type"],
            "source_lat": row["source_lat"],
            "source_lon": row["source_lon"]
        }
    }
    geojson["features"].append(feature)

# Datei speichern
with open("Parkplaetze.geojson", "w", encoding="utf-8") as f:
    json.dump(geojson, f, ensure_ascii=False, indent=2)

print("🗺️ GeoJSON-Datei gespeichert: Parkplaetze.geojson")
