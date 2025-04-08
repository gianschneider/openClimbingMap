/**
 * Schaltet die Sichtbarkeit des Naturschutzgebiete-Layers um.
 * @param {Object} layer - Der Naturschutzgebiete-Layer.
 * @param {boolean} isVisible - Der aktuelle Sichtbarkeitsstatus des Layers.
 * @param {Function} setVisibility - Funktion, um den Sichtbarkeitsstatus zu aktualisieren.
 */
export const handleNaturschutzgebieteToggle = (layer, isVisible, setVisibility) => {
  if (layer) {
    const newVisibility = !isVisible; // Sichtbarkeit umkehren
    setVisibility(newVisibility); // Sichtbarkeitsstatus aktualisieren
    layer.setVisible(newVisibility); // Layer-Sichtbarkeit ändern
  }
};
