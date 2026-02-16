const db = require("../db");

async function findByUserId(userId) {
  const [rows] = await db.query(
    `SELECT 
        DATE_FORMAT(datum_tijd, '%Y-%m-%d %H:%i') AS datum,
        categorie, locatie, status
     FROM meldingen
     WHERE user_id = ?
     ORDER BY datum_tijd DESC`,
    [userId]
  );
  return rows;
}

module.exports = { findByUserId };

async function createMelding(userId, categorie, omschrijving, locatie) {
  await db.query(
    `INSERT INTO meldingen (user_id, categorie, omschrijving, locatie, status, datum_tijd)
     VALUES (?, ?, ?, ?, 'open', NOW())`,
    [userId, categorie, omschrijving, locatie]
  );
}


async function listAll() {
  const [rows] = await db.query(
    "SELECT id, user_id, datum, categorie, locatie, status FROM meldingen ORDER BY datum DESC"
  );
  return rows;
}

async function updateStatus(id, status) {
  await db.query("UPDATE meldingen SET status = ? WHERE id = ?", [status, id]);
}

module.exports = {
  findByUserId,
  createMelding,
  listAll,
  updateStatus
};
