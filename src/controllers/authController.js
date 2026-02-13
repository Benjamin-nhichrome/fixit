const bcrypt = require("bcrypt");
const users = require("../models/userModel");

exports.showLogin = (req, res) => res.render("login", { errors: [] });

exports.showRegister = (req, res) => res.render("register", { errors: [] });

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await users.findByEmail(email);
  if (!user) return res.status(400).render("login", { errors: ["Onjuiste gegevens."] });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).render("login", { errors: ["Onjuiste gegevens."] });

  req.session.user = {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return res.redirect("/dashboard");
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).render("register", { errors: ["Alle velden zijn verplicht."] });
  }

  const exists = await users.findByEmail(email);
  if (exists) return res.status(400).render("register", { errors: ["E-mail bestaat al."] });

  if (password.length < 8) {
    return res.status(400).render("register", { errors: ["Wachtwoord moet minimaal 8 tekens zijn."] });
  }

  const password_hash = await bcrypt.hash(password, 12);
  await users.createUser(name, email, password_hash);

  return res.redirect("/login");
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
};
