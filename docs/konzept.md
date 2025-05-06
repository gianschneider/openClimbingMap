# Ursprüngliches Konzept

<a id="top"></a>

Dieser Abschnitt beschäftigt sich mit der Konzeption und der Gestaltung von openClimbingMap. Diese Überlegungen wurden vor der Datenbeschaffung und der Entwicklung des Frontends diskutiert.

### Aufbau Geodateninfrastruktur (GDI)

<div id="gdi"></div>

Das folgende Schema visualisiert den Aufbau der Geodateninfrastruktur in der Konzeptionsphase. Während der Front- und Backendentwicklung wurde diese jedoch agil an die Umstände angepasst. Je nachdem gab es unerwartete Herausforderungen oder einfachere Möglichkeiten, um das Ziel zu erreichen. Die finale Architektur der GDI ist [hier](#gdi-final) sichtbar.

![GDI Konzept](bilder/GDI_Architektur_konzept.png)

### Mockup

Zur technischen Umsetzung des Frontends wurde zuvor ein Mockup für das User-Interface designed. Die Anordnung und Darstellung der Buttons erhielt viel Aufmerksamkeit. Eine Smartphone-App wird nur genutzt, wenn sie intuitiv, einfach und schnell zu nutzen ist. Diese Überlegungen verhindern Mehraufwand während der Frontendentwicklung aufgrund von veränderten Designentscheidungen. Dennoch weicht das Frontend teils stark vom Mockup ab, weil während der Entwicklung festgestellt das nicht alles im Mockup optimal ist. Die nachfolgenden Abbildungen zeigen das Mockup.

![mockups](bilder/mockups.png)

** Die wichtigsten Abweichungen bezüglich dem Endprodukt**

- Die Balken oben und unten im Mockup wurden entfernt, um mehr Displayfläche für die Karte zu ermöglichen.
- Die Buttons sind alle rechts angeordnet, um eine einhändige Bedienung zu ermöglichen.
- Um der App einen Wiedererkennungswert zu geben, wurde links eine Kletterwand mit Piktogramm eingefügt.

### Visualisierungsideen

Als Inspiration für das Design diente die Swisstopo App von der Swisstopo. Diese App ist sehr intuitiv zu bedienen und ästehtisch ansprechend gestaltet.

[↑](#top)

<div style="display: flex; justify-content: space-between;">
  <div>
    <a href="aufbauGDI.html">← Aufbau GDI</a>
  </div>
  <div>
    <a href="ausblick.html">Erweiterungsmöglichkeiten →</a>
  </div>
</div>
