INSERT INTO haltestellen_schweiz_gesamt (
    Name, Nummer, Transportunternehmen_Nummer, Transportunternehmen_Abkuerzung,
    Betriebspunkttyp_Code, Betriebspunkttyp_Bezeichnung,
    Verkehrsmittel_Code, Verkehrsmittel_Bezeichnung,
    Gemeinde_Nummer, Gemeinde_Name, E, N, H
) VALUES
('Huttwil', 8508187, 16, 'BLS', 'VPG', 'Haltestelle und Bedienpunkt', 'B', 'Zug', 954, 'Huttwil', 2630659, 1218245, 638),
('Ferenbalm-Gurbrue', 8504485, 16, 'BLS', 'VPG', 'Haltestelle und Bedienpunkt', 'B', 'Zug', 662, 'Ferenbalm', 2583271, 1200354, 494),
('Waltensburg/Vuorz', 8509174, 154, 'RhB FR VR', 'VPG', 'Haltestelle und Bedienpunkt', 'B', 'Zug', 3981, 'Breil/Brigels', 2728430, 1181196, 744),
('Villeneuve VD', 8501303, 1, 'SBB CFF FFS', 'VPG', 'Haltestelle und Bedienpunkt', 'B', 'Zug', 5414, 'Villeneuve (VD)', 2560650, 1138686, 375),
('Domat/Ems', 8509181, 154, 'RhB FR VR', 'VPG', 'Haltestelle und Bedienpunkt', 'B', 'Zug', 3722, 'Domat/Ems', 2753678, 1188861, 581);

INSERT INTO klettergebiete (Name, X, Y, Hoehe, Disziplin, Routen, Schwierigkeit) VALUES
('Schrattenfluh', 2625000.000, 1200000.000, 1500, 'Klettern', 8, '4a- 7b+'),
('Gastlosen', 2589000.000, 1165000.000, 1900, 'Klettern', 12, '5a- 8a'),
('Creux du Van', 2550000.000, 1200000.000, 1200, 'Klettern', 5, '4c- 7a'),
('Engelberg Brunnistöckli', 2670000.000, 1190000.000, 2030, 'Klettern', 6, '5a- 6c+'),
('Churfirsten', 2720000.000, 1220000.000, 2100, 'Alpinklettern', 10, '5b- 7a');
