# Erklärung der Funktionen von openClimbingMap

<a id="top"></a>
In diesem Abschnitt werden die Funktionen und Interaktionen der openClimbingMap beschrieben.

## Startpage

<div id="startpage"></div>
Auf der Startseite erscheint eine dynamische Karte, die auf die Schweiz fokussiert ist.

---

### Funktionen:

#### 1. **Filterung von Klettergebieten**
- **Beschreibung**: 
  Die Darstellung der Klettergebiete auf der Basemap wird auf jene Gebiete beschränkt, die den eingegebenen Suchparametern entsprechen.
- **Hinweis**: 
  Dieser Abschnitt wird genauer erläutert, sobald die Funktion implementiert ist.

---

#### 2. **Info-Button**
- **Beschreibung**: 
  Unter diesem Button werden wichtige Informationen zur App in einem eigenen Fenster angezeigt:
  - Nutzung der Anwendung
  - Verfügbare Funktionen
  - Allgemeine Informationen zum Klettersport
- **Zusatz**: 
  Eine Legende der Schwierigkeitsgrade der Routen in den Klettergebieten wird ebenfalls angezeigt.

---

#### 3. **Layer-Button**
- **Beschreibung**: 
  Ermöglicht das Wechseln zwischen drei verschiedenen Hintergrundkarten:
  1. **Swisstopo farbig**
  2. **Luftbild**
  3. **Geocover (Gesteinskarte)**

- **Zusätzliche Layer**:
  - Naturschutzgebiete (WFS-Dienst vom GeoServer)
  - ÖV-Haltestellen (WFS-Dienst vom GeoServer)

---

#### 4. **Klettergebiet erfassen**
- **Beschreibung**: 
  Beim Klick auf den entsprechenden Button öffnet sich ein Eingabefenster zur Erfassung der Attribute eines neuen Klettergebiets.

- **Validierung**:
  - Doppelte Namen werden verhindert.
  - Negative Routenanzahlen sind nicht erlaubt.
  - Warnung, falls sich das Gebiet innerhalb eines Naturschutzgebiets befindet.

- **Eingabemöglichkeiten**:
  1. **Disziplin und Schwierigkeitsgrad**: Auswahl über Dropdown-Menüs.
  2. **Koordinaten**:
     - Manuell als LV95-Koordinaten.
     - Automatisch via GPS-Position (umgerechnet in LV95 / EPSG:2056).
     - Durch Klick auf einen Punkt auf der Karte.
  3. **Höhe**: Automatisiert über eine API von Swisstopo bezogen.

- **Buttons im Eingabefenster**:
  - **Hinzufügen**: Überträgt die eingegebenen Daten via FastAPI-Schnittstelle in die PostgreSQL/PostGIS-Datenbank und zeigt das neue Klettergebiet auf der Karte.
  - **Reset**: Setzt alle Eingabefelder auf ihren Ursprungszustand zurück.
  - **Abbrechen**: Schließt das Eingabefenster ohne zu speichern.

---

#### 5. **Navigation zur eigenen Position**
- **Beschreibung**: 
  Beim Klick auf den Emlid-Button wird zur aktuellen Position des Nutzers auf der Karte gezoomt.

---

#### 6. **Suchfunktion**
- **Beschreibung**: 
  Beim Eintippen eines Begriffs ins Suchfeld wird die GeoJSON-Datenliste (vom GeoServer) gefiltert.
- **Funktionalität**:
  - Nur Klettergebiete, deren Name mit dem eingegebenen Begriff beginnt, bleiben sichtbar.
  - Ergebnisse erscheinen in einer Liste.
  - Bei Klick auf ein Ergebnis wird auf das entsprechende Gebiet gezoomt.

---

[↑ Zurück nach oben](#top)

<div style="display: flex; justify-content: space-between;">
  <div>
    <a href="einleitung.html">← Einleitung</a>
  </div>
  <div>
    <a href="aufbauGDI.html">Aufbau GDI →</a>
  </div>
</div>
