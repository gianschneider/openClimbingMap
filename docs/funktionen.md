# Erklärung der Funktionen von openClimbingMap

<a id="top"></a>
In diesem Abschnitt werden die Funktionen und Interaktionen der openClimbingMap beschrieben.

## Startpage

<div id="startpage"></div>
Das Frontend besteht aus einer One-Page-Applikation im Smartphone-Layout, die mehrere Funktionen bietet, wie die Auswahl der Hintergrundkarte, das Zoomen auf den aktuellen Standort, die Erfassung neuer Gebiete und die Filterung der Klettergebiete. Die Klettergebiete werden als Punkte dargestellt. Nahe beieinanderliegende Punkte werden automatisch gruppiert und als gemeinsamer Kreis mit der Anzahl der enthaltenen Gebiete dargestellt. Beim Klicken auf ein Klettergebiet öffnet sich ein Pop-up-Fenster mit Detailinformationen (Name, Höhe, Disziplin, Anzahl der Routen, Schwierigkeit). Zusätzlich werden die Wetterdaten für den Standort des Klettergebiets angezeigt. Die Klettergebiete und deren Attribute werden über einen WFS-Dienst vom GeoServer bereitgestellt, während die Wetterdaten über die API der meteoblue AG abgerufen werden.

<div style="display: flex; justify-content: center; gap: 20px;">
  <img src="bilder/Klettergebiet.jpg" style="max-width: 45%; height: auto;">
  <img src="bilder/zoom.jpg" style="max-width: 45%; height: auto;">
</div>

---

### Funktionen:

#### 1. **Filterung von Klettergebieten**

- Die Darstellung der Klettergebiete auf der Basemap wird auf jene Gebiete beschränkt, die den eingegebenen Filterparametern entsprechen. Diese Filterparameter umfassen die Disziplin (Sportklettern oder Alpinklettern), die über Checkboxen ein- oder abgewählt werden können. Mit einem Doppelslider lassen sich die Minimal- und Maximalwerte für die Höhe über Meer, die Anzahl Routen und die Schwierigkeitsstufe einstellen. Diese Suchfunktionen werden anschliessend als Filterkriterien genutzt, um nur die gewünschten Klettergebiete darzustellen.
  Mit dem Button _Anwenden_ wird die Filterfunktion ausgeführt, und mit dem Button _Reset_ werden die Ausgangsparameter wiederhergestellt.

<div style="text-align: center;">
  <video width="400" controls>
    <source src="videos/filter.mp4" type="video/mp4">
    Dein Browser unterstützt das Video-Tag nicht.
  </video>
</div>

---

#### 2. **Info-Button**

- Unter diesem Button werden wichtige Informationen zur App in einem eigenen Fenster angezeigt:
  - Nutzung der Anwendung
  - Verfügbare Funktionen
  - Allgemeine Informationen zum Klettersport, einschliesslich einer Legende zu den Schwierigkeitsgraden der Routen in den Klettergebieten.

<div style="text-align: center;">
  <video width="400" controls>
    <source src="videos/Info.mp4" type="video/mp4">
    Dein Browser unterstützt das Video-Tag nicht.
  </video>
</div>

---

#### 3. **Layer-Button**

- Ermöglicht das Wechseln zwischen drei verschiedenen Hintergrundkarten:

  1. Swisstopo farbig
  2. Luftbild
  3. Geocover (Gesteinskarte)

- Zusätzliche Layer, die über eine Checkbox ein- und ausgeschaltet werden können:
  - Naturschutzgebiete (WFS-Dienst vom GeoServer)
  - ÖV-Haltestellen (WFS-Dienst vom GeoServer)

<div style="text-align: center;">
  <video width="400" controls>
    <source src="videos/Hintergrund.mp4" type="video/mp4">
    Dein Browser unterstützt das Video-Tag nicht.
  </video>
</div>

<div style="display: flex; justify-content: center; gap: 20px;">
  <img src="bilder/Haltestellen.png" style="max-width: 45%; height: auto;">
</div>

![Ansicht der Haltestellen](bilder/Haltestellen.png)

---

#### 4. **Klettergebiet erfassen**

- Beim Klicken auf den entsprechenden Button öffnet sich ein Eingabefenster zur Erfassung der Attribute eines neuen Klettergebiets.

- Validierung:

  - Doppelte Namen werden verhindert.
  - Negative Routenanzahlen sind nicht erlaubt.
  - Warnung, falls sich das Gebiet innerhalb eines Naturschutzgebiets befindet.

- Eingabemöglichkeiten:

  1. Disziplin und Schwierigkeitsgrad: Auswahl über Dropdown-Menüs.
  2. Koordinaten:
     - Manuell als LV95-Koordinaten.
     - Automatisch via GPS-Position (umgerechnet in LV95 / EPSG:2056).
     - Durch Klicken auf einen Punkt auf der Karte.
  3. Höhe: Automatisiert über eine API von Swisstopo bezogen.

- Buttons im Eingabefenster:
  - _Hinzufügen_: Überträgt die eingegebenen Daten via FastAPI-Schnittstelle in die PostgreSQL/PostGIS-Datenbank und das neue Klettergebiet wird auf der Karte dargestellt.
  - _Reset_: Setzt alle Eingabefelder auf ihren Ursprungszustand zurück.
  - _Abbrechen_: Schliesst das Eingabefenster ohne zu speichern.

<div style="text-align: center;">
  <video width="400" controls>
    <source src="videos/Erfassen.mp4" type="video/mp4">
    Dein Browser unterstützt das Video-Tag nicht.
  </video>
</div>

---

#### 5. **Navigation zur eigenen Position**

- Beim Klicken auf den Emlid-Button wird zur aktuellen Position des Nutzers auf der Karte gezoomt.

<div style="text-align: center;">
  <video width="400" controls>
    <source src="videos/Emlid.mp4" type="video/mp4">
    Dein Browser unterstützt das Video-Tag nicht.
  </video>
</div>

---

#### 6. **Suchfunktion**

- Beim Eintippen eines Begriffs im Suchfeld wird die GeoJSON-Datenliste (vom GeoServer) gefiltert.
- Funktionalität:
  - Nur Klettergebiete, deren Name mit dem eingegebenen Begriff beginnt, bleiben sichtbar.
  - Ergebnisse erscheinen in einer Liste.
  - Bei Klicken auf ein Ergebnis wird auf das entsprechende Gebiet gezoomt.

<div style="text-align: center;">
  <video width="400" controls>
    <source src="videos/Suchen.mp4" type="video/mp4">
    Dein Browser unterstützt das Video-Tag nicht.
  </video>
</div>

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
