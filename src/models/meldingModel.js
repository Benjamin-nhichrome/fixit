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

// 3) Admin: list all meldingen + user info
async function listAll() {
  const [rows] = await db.query(
    `SELECT 
        m.melding_id,
        m.user_id,
        DATE_FORMAT(m.datum_tijd, '%Y-%m-%d %H:%i') AS datum,
        m.categorie,
        m.locatie,
        m.status,
        u.name,
        u.email
     FROM meldingen m
     LEFT JOIN users u ON m.user_id = u.user_id
     ORDER BY m.datum_tijd DESC`
  );
  return rows;
}

async function getStatusCounts() {
  const [rows] = await db.query(`
    SELECT status, COUNT(*) AS total
    FROM meldingen
    GROUP BY status
  `);

  const counts = {
    open: 0,
    in_behandeling: 0,
    opgelost: 0,
    gesloten: 0,
  };

  rows.forEach((row) => {
    counts[row.status] = row.total;
  });

  return counts;
}

// 4) Admin: update status
async function updateStatus(meldingId, status) {
  await db.query(
    "UPDATE meldingen SET status = ? WHERE melding_id = ?",
    [status, meldingId]
  );
}

module.exports = {
  listByUser,
  findByUserId,
  createMelding,
  listAll,
  updateStatus,
  getStatusCounts,
};