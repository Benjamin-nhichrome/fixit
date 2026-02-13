const pool = require("../db");

async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

async function createUser(name, email, password_hash) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, password_hash]
  );
  return result.insertId;
}

module.exports = { findByEmail, createUser };
