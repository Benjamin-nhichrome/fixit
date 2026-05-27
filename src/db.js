/*
  Oudere database connectie.
  In de huidige app gebruiken we vooral src/config/db.js.

  Dit bestand mag blijven bestaan voor compatibility,
  maar het is beter om overal require("../config/db") te gebruiken.
*/
const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "fixit",
});

module.exports = db;
