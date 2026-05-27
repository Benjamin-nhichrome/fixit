//Dit bestand praat met de database voor gebruikers.
// Database connectie.
const db = require("../config/db");

/*
  findByEmail:
  Zoekt één gebruiker op basis van email.
  Dit wordt gebruikt bij login en ook om dubbele registraties te voorkomen.
*/
async function findByEmail(email) {
  const [rows] = await db.query(
    "SELECT user_id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  // rows[0] is de gevonden gebruiker. Als er geen gebruiker is, is dit undefined.
  return rows[0];
}

/*
  createUser:
  Maakt een nieuwe gebruiker aan.
  Nieuwe gebruikers krijgen standaard role = "user".
  Admin kun je later maken via phpMyAdmin door role naar "admin" te zetten.
*/
async function createUser({ name, email, passwordHash }) {
  await db.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, "user"]
  );
}

module.exports = {
  findByEmail,
  createUser,
};
