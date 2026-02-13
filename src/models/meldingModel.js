const pool = require("../db");

async function createMelding(userId, categorie, omschrijving, locatie) {
  await pool.query(
    "INSERT INTO meldingen (user_id, categorie, omschrijving, locatie) VALUES (?, ?, ?, ?)",
    [userId, categorie, omschrijving, locatie]
  );
}

async function listByUser(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM meldingen WHERE user_id = ? ORDER BY datum_tijd DESC",
    [userId]
  );
  return rows;
}

async function listAll() {
  const [rows] = await pool.query(
    `SELECT m.*, u.name, u.email
     FROM meldingen m
     JOIN users u ON u.user_id = m.user_id
     ORDER BY m.datum_tijd DESC`
  );
  return rows;
}

async function updateStatus(id, status) {
  await pool.query("UPDATE meldingen SET status = ? WHERE melding_id = ?", [status, id]);
}

module.exports = { createMelding, listByUser, listAll, updateStatus };
