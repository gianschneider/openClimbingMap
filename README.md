# openClimbingMap
Die openClimbingMap ist eine interaktive Webapplikation, die speziell für Kletterbegeisterte entwickelt wurde. Sie bietet eine open-source-Plattform, um Klettergebiete zu entdecken, Informationen zu teilen und neue Gebiete zu erfassen. Zusätzlich können Wetterdaten für die jeweiligen Gebiete abgerufen werden.

Mehr Infos findest Du auf unserer GitHub Page: https://gianschneider.github.io/openClimbingMap

Im Rahmen des Vertiefungsmodul 4230 „Geoinformatik & Raumanalyse I“ des Bachelorstudiengangs Geomatik an der Fachhochschule Nordwestschweiz (FHNW) wurde dieses Server Client Projekt entwickelt. 
Folgende Technologien wurden dafür verwendet:

- **Frontend:** React.js, OpenLayers, MUI
- **Backend:** Python-Bibliotheken: (Requests, psycopg2, pydantic, fastapi, uvicorn), GeoServer, PostgreSQL, PostGIS

Getestet mit Node version 22.14.0, openlayers 9.1.0, react 18.3.1

## Requirements

- [Git](https://git-scm.com/)
- IDE wie [Visual Studio Code](https://code.visualstudio.com/)
- [Anaconda Distribution](https://www.anaconda.com/products/distribution) oder [Miniconda](https://docs.conda.io/en/latest/miniconda.html)
- Node.js und npm ([https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))

## Repository lokal klonen
Mit Git in einem Terminal das GitHub Repository *openClimbingMap* in ein lokales Verzeichnis klonen.

``` shell
cd /path/to/workspace
# Clone Repository 
git clone git@github.com:gianschneider/openClimbingMap.git
```

### Git Projekt mit Visual Studio Code lokal klonen
Öffne ein neues Visual Studio Code Fenster und wähle unter Start *Clone Git Repository*. Alternativ öffne die Command Palette in VS Code `CTRL+Shift+P` (*View / Command Palette*) und wähle `Git: clone`. 
Füge die Git web URL `https://github.com/gianschneider/openClimbingMap` ein und bestätige die Eingabe mit Enter. Wähle einen Ordner in welchen das Repository *geklont* werden soll.

## Datenbank installieren
Es wird ein PostgreSQL Server benötigt. Falls dieser nicht vorhanden ist, kann er [hier](https://www.postgresql.org/download/) heruntergeladen und installiert werden. Dabei sollen Stack Builder, pgAdmin 4, PostgreSQL Server und  Command Line Tool installiert werden. Während dieser Installation wird ein `user`, `password` und `port` definiert.Anschliessend PostGIS mit dem Stack Builder installiern.

Sobald in der Software pgAdmin 4 eine Serververbindung mit den vorhin definierten Verbindungsdaten hergestellt wurde, kann eine Datenbank erstellt werden (z. B. geoserver). Anschliessend werden die Tabellen erstellt und mit den Daten befüllt.

Hier sind nachfolgend die sql-Dateien, um die Tabellen zu erstellen und mit Beispiel-Daten zu befüllen:

- [Tabelle erstellen]()
- [Daten einlesen]()

## Geoserver
Diese Datenbankdaten werden in einem nächsten Schritt in Geoserver veröffentlicht. Von hier bezieht unser Projekt anschliessend die Geodaten.

In einem ersten Schnitt muss man Geoserver lokal installieren. Eine Anleitung findest du [hier](). Danach kann du dich auf `http://localhost:8080/geoserver` anmelden. Erstelle anschliessend einen neuen Arbeitsbereich namens `GDI_openclimbingmap` sowie einen neuen Datenspeicher namens `ocm`. Den Datenspeicher verknüpftst du mit der zuvor erstellten Datenbank. Gib dazu die selbstdefinierten Werte für `user`, `port`, `password` und den Namen der Datenbank ein, um die Verbindung herzustellen.

Jetzt kannst du neue Layer hinzufügen. Gehe dazu auf `Layer`, dann auf `Neuen Layer hinzufügen`. Wähle deine erstellten Arbeitsbereich aus. Nun siehst du alle Tabellen, welche auf deiner Datenbank sind. Mit `Publizieren` kannst du den Layer hinzufügen. Dafür muss noch das Koordinatensystem (EPSG:2056) und das begrenzende Rechteck berechnet werden.


## Frontend installieren
Öffne ein Terminal (Command Prompt in VS Code) und wechsle in den *client* Ordner in diesem Projekt

``` shell
cd client
```
``` shell
# installiere alle node.js dependencies
npm install
npm install react-range
```
``` shell
# Projekt ausführen
npm run dev
```

## Backend lokal installieren
Öffne ein Terminal und wechsle in den *server* Ordner.
1. Virtuelle Umgebung für Python mit allen Requirements in der `requirements.txt` Datei aufsetzen.

```shell
# Requirements
cd server
# Füge conda-forge den als Channel in conda hinzu, da sonst nicht alle Pakete installiert werden können.
conda config --add channels conda-forge
# Erstelle ein neues Conda Environment und füge die Python Packges requirements.txt hinzu, requirements.txt befindet sich im Ordner server/app
conda create --name gdiproject python=3.10.9 --file app/requirements.txt
```

2. Backend ausführen, virtuelle Umgebung starten und server *uvicorn* starten. Öffne http://localhost:8000/docs im Browser und verifiziere, ob das Backend läuft.
``` shell
cd server
# aktiviere die conda umgebung gdiproject
conda activate gdiproject
# start server auf localhost aus dem Ordner "server"
uvicorn app.main:app --reload
# Öffne die angegebene URL im Browser und verifiziere, ob das Backend läuft.
```

## API Dokumentation
Fast API kommt mit vorinstallierter Swagger UI. Wenn der FastAPI Backend Server läuft, kann auf die Dokumentation der API über Swagger UI auf http://localhost:8000/docs verfügbar.

## Optional: Backendinstallation auf einem Server
Diese Anleitung richtet sich an die Inbetriebnahme des Backends auf einem Linux:

```
Raspi starten und einrichten, d.h. Internetverbindung aufbauen

# Bash öffnen und zu gewünschtem Root-Verzeichnis navigieren
cd /home/USER/documents

# Projekt klonen
git clone https://github.com/gianschneider/openClimbingMap.git

# Environment erstellen und aktivieren
python -m venv backend
source backend/bin/activate

# Pakete installieren
sudo apt-get install python3-dev
pip install --upgrade setuptools
pip3 install fastapi
pip3 install uvicorn
pip3 install requests
pip3 install psycopg2
pip3 install pydantic

# SSH aktivieren
sudo raspi-config 

# Setup SSH Verbindung (unter drittens wlan0 inet ist die ip zu finden)
ip a 

# Backend starten
cd openClimbingMap/server/
uvicorn app.main:app --host 0.0.0.0 --port 8000 oder uvicorn app.main:app --reload
```
