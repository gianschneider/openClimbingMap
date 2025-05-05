# GDI_Project
Server Client Projekt für eine Geodateninfrastruktur Webportal im Rahmen des Moduls 4230

- **Frontend:** React.js, OpenLayers, MUI
- **Backend:** Python-Bibliotheken: (Requests, psycopg2, pydantic, fastapi, uvicorn), GeoServer, PostgreSQL, PostGIS

GitHub Pages: https://gianschneider.github.io/openClimbingMap

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

## Backend installieren
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
Fast API kommt mit vorinstallierter Swagger UI. Wenn der Fast API Backen Server läuft, kann auf die Dokumentation der API über Swagger UI auf http://localhost:8000/docs verfügbar.

## Backend
Diese Anleitung richtet sich an die Inbetriebnahme des Backends auf dem Raspberry 4:

1.) Raspi starten und einrichten, d.h. Internetverbindung aufbauen

2.) Bash öffnen und zu gewünschtem Root-Verzeichnis navigieren (cd /home/USER/documents)

3.) git clone https://github.com/gianschneider/openClimbingMap.git

4.) python -m venv backend

5.) source backend/bin/activate

6.) sudo apt-get install python3-dev

7.) pip install --upgrade setuptools

8.) pip3 install fastapi

9.) pip3 install uvicorn

10.) pip3 install requests

11.) pip3 install psycopg2

12.) pip3 install pydantic

13.) cd /home/USER/documents/openClimbingMap/server/app/
     python main.py
-> Beispielabfragen ausprobieren

14.) sudo raspi-config 
SSH aktivieren

15.) setup SSH Verbindung: ip a 
unter drittens wlan0 inet ist die ip zu finden

16.) cd openClimbingMap/server/

17.) uvicorn app.main:app --host 0.0.0.0 --port 8000 oder uvicorn app.main:app --reload


##nutzendes Gerät

Auf nutzendem Gerät: cmd öffnen und eingeben:
ssh pi@10.175.27.25
password = password


## Verwendung
Öffne deinen Browser und gehe zu `http://localhost:5173`.
