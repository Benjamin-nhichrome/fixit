const db = require("../db");

async function findByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0] || null;
}

async function createUser({ name, email, passwordHash }) {
  await db.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
    [name, email, passwordHash]
  );
}

module.exports = { findByEmail, createUser };
