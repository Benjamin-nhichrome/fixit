// mysql2/promise geeft ons async/await ondersteuning voor MySQL queries.
const mysql = require("mysql2/promise");

/*
  Database pool:
  Een pool houdt meerdere database connecties klaar.
  Dat is beter dan voor elke query een nieuwe connectie openen.
*/
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "fixit",
  port: Number(process.env.DB_PORT || 3306),

  // Wacht op beschikbare connecties als alle connecties bezig zijn.
  waitForConnections: true,

  // Maximaal 10 connecties tegelijk.
  connectionLimit: 10,

  // Geen limiet op wachtende queries.
  queueLimit: 0,
});

// Exporteert de database pool zodat models queries kunnen uitvoeren.
module.exports = pool;
