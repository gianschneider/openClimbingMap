CREATE TABLE Haltestellen (
    Name VARCHAR(100),
    Nummer INT,
    Transportunternehmen_Nummer INT,
    Transportunternehmen_Abkuerzung VARCHAR(50),
    Betriebspunkttyp_Code VARCHAR(10),
    Betriebspunkttyp_Bezeichnung VARCHAR(100),
    Verkehrsmittel_Code VARCHAR(10),
    Verkehrsmittel_Bezeichnung VARCHAR(50),
    Gemeinde_Nummer INT,
    Gemeinde_Name VARCHAR(100),
    E INT,
    N INT,
    H INT
);

CREATE TABLE klettergebiete (
    Name VARCHAR(100),
    X DOUBLE PRECISION,
    Y DOUBLE PRECISION,
    Hoehe INT,
    Disziplin VARCHAR(50),
    Routen INT,
    Schwierigkeit VARCHAR(50)
);
