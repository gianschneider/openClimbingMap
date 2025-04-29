# Erklärung der Funktionen von openClimbingMap

<a id="top"></a>
In diesem Abschnitt werden die Funktionen und Interaktionen der openClimbingMap beschrieben.

## Startpage

<div id="startpage"></div>
Auf der Startseite erscheint eine dynamische Karte, die auf die Schweiz fokussiert ist. ...

### Funktionen:

- Filterung von Klettergebieten
In dieser Funktion wird die Darstellung der Klettergebiete auf der Basemap auf jene Gebiete beschränkt, die den eingegebenen Suchparametern entsprechen. (Dieser Abschnitt wird genauer erläutert, sobald die Funktion implementiert ist.)

- Info-Button
Unter diesem Button werden wichtige Informationen zur App in einem eigenen Fenster angezeigt – zur Nutzung der Anwendung, zu den verfügbaren Funktionen sowie zum Klettersport allgemein, zum Beispiel in Form einer Legende der Schwierigkeitsgrade der Routen in den Klettergebieten.

- Layer-Button
Unter diesem Button haben die Benutzenden die Möglichkeit, zwischen drei verschiedenen Hintergrundkarten zu wählen: Swisstopo farbig, Luftbild und Geocover (Gesteinskarte). Diese werden als WMS-Layer von Swisstopo bereitgestellt.
Zusätzlich können über Checkboxen weitere Layer über der Hintergrundkarte eingeblendet werden. Dabei handelt es sich um die Naturschutzgebiete und ÖV-Haltestellen, die als WFS-Dienste vom GeoServer geladen werden.

- Klettergebiet erfassen
Beim Klick auf den entsprechenden Button öffnet sich ein Eingabefenster zur Erfassung der Attribute eines neuen Klettergebiets. Eingabefelder sind validiert, sodass z. B. doppelte Namen oder negative Routenanzahlen verhindert werden. Eine zusätzliche Prüfung warnt, falls sich das Gebiet innerhalb eines Naturschutzgebiets befindet, da dort keine Klettergebiete liegen dürfen. Disziplin und Schwierigkeitsgrad (von/bis) werden über Dropdown-Menüs ausgewählt.
Die Koordinaten können auf drei Arten eingegeben werden:
manuell als LV95-Koordinaten,
automatisch via GPS-Position (umgerechnet in LV95 / EPSG:2056),
durch Klick auf einen Punkt auf der Karte.
Die Höhe des Standorts wird automatisiert über eine API von Swisstopo bezogen.
Im Eingabefenster stehen drei Buttons zur Verfügung:
Hinzufügen: Überträgt die eingegebenen Daten via FastAPI-Schnittstelle in die PostgreSQL/PostGIS-Datenbank und zeigt das neue Klettergebiet auf der Karte,
Reset: Setzt alle Eingabefelder auf ihren Ursprungszustand zurück,
Abbrechen: Schließt das Eingabefenster ohne zu speichern.

- Navigation zur eigenen Position
Beim Klick auf den Emlid-Button wird zur aktuellen Position des Nutzers auf der Karte gezoomt.

- Suchfunktion
Beim Eintippen eines Begriffs ins Suchfeld wird die GeoJSON-Datenliste (vom GeoServer) gefiltert. Nur Klettergebiete, deren Name mit dem eingegebenen Begriff beginnt, bleiben sichtbar. Die Ergebnisse erscheinen in einer Liste. Bei Klick auf ein Ergebnis wird auf das entsprechende Gebiet gezoomt.





[↑](#top)

<div style="display: flex; justify-content: space-between;">
  <div>
    <a href="einleitung.html">← Einleitung</a>
  </div>
  <div>
    <a href="aufbauGDI.html">Aufbau GDI →</a>
  </div>
</div>
