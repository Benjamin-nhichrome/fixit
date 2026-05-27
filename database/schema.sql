-- Database schema voor FixIT
-- Dit schema hoort bij de huidige Node.js/Express code.

-- Users tabel:
-- Hier worden alle gebruikers opgeslagen.
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user','admin') DEFAULT 'user'
);

-- Meldingen tabel:
-- Hier worden alle service desk meldingen/tickets opgeslagen.
CREATE TABLE IF NOT EXISTS meldingen (
    melding_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    omschrijving TEXT NOT NULL,
    locatie VARCHAR(255) NOT NULL,
    prioriteit ENUM('laag','normaal','hoog','kritiek') DEFAULT 'normaal',
    status ENUM('open','in_behandeling','opgelost','gesloten') DEFAULT 'open',
    datum_tijd TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Elke melding hoort bij één gebruiker.
    -- Als een gebruiker wordt verwijderd, worden zijn/haar meldingen ook verwijderd.
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
