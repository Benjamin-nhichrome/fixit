const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

// GET /login
function showLogin(req, res) {
  res.render("login", { error: null });
}

// POST /login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("login", { error: "Vul email en wachtwoord in." });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).render("login", { error: "Gebruiker bestaat niet." });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).render("login", { error: "Wachtwoord is onjuist." });
    }

    req.session.user = {
      id: user.user_id,
      name: user.name,
      role: user.role,
    };

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    return res.status(500).render("login", { error: "Serverfout, probeer opnieuw." });
  }
}

// GET /register
function showRegister(req, res) {
  res.render("register", { error: null });
}

// POST /register
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).render("register", { error: "Vul alle velden in." });
    }

    const exists = await userModel.findByEmail(email);
    if (exists) {
      return res.status(409).render("register", { error: "Email bestaat al." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await userModel.createUser({ name, email, passwordHash });

    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    return res.status(500).render("register", { error: "Serverfout, probeer opnieuw." });
  }
}

// POST /logout
function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}

module.exports = { showLogin, login, showRegister, register, logout };
