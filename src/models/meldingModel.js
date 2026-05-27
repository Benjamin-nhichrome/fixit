// Database connectie.
const db = require("../config/db");

/*
  listByUser:
  Haalt alle meldingen op van één specifieke gebruiker.
  Dit wordt gebruikt op het dashboard.
*/
async function listByUser(userId) {
  const [rows] = await db.query(
    `SELECT 
        melding_id,
        user_id,
        DATE_FORMAT(datum_tijd, '%Y-%m-%d %H:%i') AS datum,
        categorie,
        omschrijving,
        locatie,
        prioriteit,
        status
     FROM meldingen
     WHERE user_id = ?
     ORDER BY datum_tijd DESC`,
    [userId]
  );

  return rows;
}

/*
  findByUserId:
  Alias voor listByUser.
  Dit is handig als andere code deze naam gebruikt.
*/
async function findByUserId(userId) {
  return listByUser(userId);
}

/*
  createMelding:
  Maakt een nieuwe melding/ticket aan.
  Elke melding wordt gekoppeld aan de ingelogde gebruiker via user_id.
*/
async function createMelding(userId, categorie, omschrijving, locatie, prioriteit = "normaal") {
  await db.query(
    `INSERT INTO meldingen (user_id, categorie, omschrijving, locatie, prioriteit, status, datum_tijd)
     VALUES (?, ?, ?, ?, ?, 'open', NOW())`,
    [userId, categorie, omschrijving, locatie, prioriteit]
  );
}

/*
  listAll:
  Haalt alle meldingen op voor het admin panel.
  Door de JOIN met users kan admin ook naam en email van de melder zien.
*/
async function listAll() {
  const [rows] = await db.query(
    `SELECT 
        m.melding_id,
        m.user_id,
        DATE_FORMAT(m.datum_tijd, '%Y-%m-%d %H:%i') AS datum,
        m.categorie,
        m.omschrijving,
        m.locatie,
        m.prioriteit,
        m.status,
        u.name,
        u.email
     FROM meldingen m
     LEFT JOIN users u ON m.user_id = u.user_id
     ORDER BY m.datum_tijd DESC`
  );

  return rows;
}

/*
  getStatusCounts:
  Telt hoeveel meldingen er zijn per status.
  Dit wordt gebruikt voor de statistiek-cards bovenaan de admin pagina.
*/
async function getStatusCounts() {
  const [rows] = await db.query(`
    SELECT status, COUNT(*) AS total
    FROM meldingen
    GROUP BY status
  `);

  // Startwaarde zodat de admin pagina altijd 0 kan tonen als er geen meldingen zijn.
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

/*
  updateStatus:
  Admin kan de status van een melding aanpassen.
*/
async function updateStatus(meldingId, status) {
  await db.query(
    "UPDATE meldingen SET status = ? WHERE melding_id = ?",
    [status, meldingId]
  );
}

/*
  deleteMelding:
  - Admin mag elke melding verwijderen.
  - Normale gebruiker mag alleen zijn eigen melding verwijderen.
*/
async function deleteMelding(meldingId, userId, isAdmin) {
  if (isAdmin) {
    return db.query(
      "DELETE FROM meldingen WHERE melding_id = ?",
      [meldingId]
    );
  }

  return db.query(
    "DELETE FROM meldingen WHERE melding_id = ? AND user_id = ?",
    [meldingId, userId]
  );
}

module.exports = {
  listByUser,
  findByUserId,
  createMelding,
  listAll,
  updateStatus,
  getStatusCounts,
  deleteMelding,
};
