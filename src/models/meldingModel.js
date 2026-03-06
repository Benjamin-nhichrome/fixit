const db = require("../config/db");

// 1) User dashboard: list meldingen for logged-in user
async function listByUser(userId) {
  const [rows] = await db.query(
    `SELECT 
        melding_id,
        user_id,
        DATE_FORMAT(datum_tijd, '%Y-%m-%d %H:%i') AS datum,
        categorie,
        omschrijving,
        locatie,
        status
     FROM meldingen
     WHERE user_id = ?
     ORDER BY datum_tijd DESC`,
    [userId]
  );
  return rows;
}

// Alias if some parts of your code call findByUserId
async function findByUserId(userId) {
  return listByUser(userId);
}

// 2) Create melding/ticket
async function createMelding(userId, categorie, omschrijving, locatie) {
  await db.query(
    `INSERT INTO meldingen (user_id, categorie, omschrijving, locatie, status, datum_tijd)
     VALUES (?, ?, ?, ?, 'open', NOW())`,
    [userId, categorie, omschrijving, locatie]
  );
}

// 3) Admin: list all meldingen
async function listAll() {
  const [rows] = await db.query(
    `SELECT 
        melding_id,
        user_id,
        DATE_FORMAT(datum_tijd, '%Y-%m-%d %H:%i') AS datum,
        categorie,
        locatie,
        status
     FROM meldingen
     ORDER BY datum_tijd DESC`
  );
  return rows;
}

// 4) Admin: update status
async function updateStatus(meldingId, status) {
  await db.query(
    "UPDATE meldingen SET status = ? WHERE melding_id = ?",
    [status, meldingId]
  );
}

// ✅ ONE export block only
module.exports = {
  listByUser,
  findByUserId,
  createMelding,
  listAll,
  updateStatus,
};