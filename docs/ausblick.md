<a id="top"></a>

# Erweiterungsmöglichkeiten

<div id="erweiterungsmöglichkeiten"></div>

Im folgenden Abschnitt werden für Verbesserungs- und Erweiterungsvorschläge beschrieben, mit welchen die App verbessert werden könnte. Diese können Vorteile für die User Experience bringen oder die openClimbingMap um weitere Features erweitern.

### Allgemein

- Die App könnte in zwei Nutzungspfade aufgeteilt werden. Die dargestellten Elemente werden auf den jeweiligen Nutzungspfad optimiert. Statt Kompromisse einzugehen, weil alle Funktionen auf einer Seite dargestellt werden, kann eine optimale Darstellung erreicht werden. Die Nutzungspfade sind einerseits «Klettergebiete erkunden» und «Klettergebiet erfassen». Der jeweilige Nutzungspfad könnte zu Beginn einer Session ausgewählt werden.

- Die App ist zurzeit nur auf die Schweiz bezogen. Um die App im globalen Massstab beliebt zu machen, würden einige Änderungen nötig werden. Beispielsweise könnten eine lokale Landeskarte genutzt werden oder eine globale Karte wie openStreeMap. Das Backend müsste aufgrund grösserer Datenabfragen und grösserer Datenmengen performanter designt werden. Auch sollten Mechanismen zur Datensicherheit implementiert werden.

<div id="allgemein"></div>

### Datenvisualisierung

- Die Daten der Klettergebiete könnten informationsbringender dargestellt werden anstatt durch generische Punkte. Eine Möglichkeit wäre es, die Anzahl und Schwierigkeiten der Routen als Balkendiagramme darzustellen. Diese passen sich dynamisch an die Zoomstufe an. So kann ein passendes Klettergebiet schneller gefunden werden, ohne sich durch alle Punkte durchzuklicken. Ein Beispiel ist in folgendem Mockup dargestellt.

![datendarstellung](bilder/alternative-datendarstellung.png)

- Es könnte eine Liste implementiert werden, durch die der User sich durch die Klettergebiete wischen kann. Diese Liste ist dynamisch mit der Karte verknüpft und kann durch die Filterkriterien eingeschränkt werden.

- Es könnten Bilder in die Datenbank gespeichert werden, um die Routen und Sektoren der Klettergebiete darzustellen.

- Es könnten 3D-Darstellungen der Kletterrouten innerhalb eines 3D-Viewers implementiert werden. Mit den AR-Möglichkeiten eines Smartphones könnten diese mit der Realität in Übereinstimmung gebracht werden. So könnten vor Ort die Routen durch die Smartphonekamera in 3D dargestellt werden. Dieses Feature ist komplex und müsste genügend robust implementiert werden, damit es genutzt wird.

### Parkplätze, ÖV und Routing

- Um den Zugang zu einem Klettergebiet aufzuzeigen, wird zurzeit ein Routing implementiert. Die zwei gängisten Möglichkeiten um zu einem Klettergebiet zu gelangen, sind mit Auto, ÖV, Fahrrad und zu Fuss. Meist ist eine Kombination von zwei Möglichkeiten das Mittel der Wahl. Dieses Routing könnte beispielsweise vom aktuellen Standort oder von einer Adresse nach Wahl bis zum gewünschten Klettergebiet erfolgen. Einige Möglichkeiten werden getestet. Geeignet scheint die Routes API von Google, die jedoch kostenpflichtig ist. Alternativ könnte openRoutesService genutzt werden. Es unterstützt das Routing von Auto, Velo und zu Fuss, jedoch kein ÖV.

[↑](#top)

<div style="display: flex; justify-content: space-between;">
  <div>
    <a href="funktionen.html">← Konzept und Ideen</a>
  </div>
  <div>
   <a href="quellenverzeichnis.html">Quellenverzeichnis →</a>
  </div>
</div>
