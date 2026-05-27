// bcrypt wordt gebruikt om wachtwoorden veilig te hashen en te controleren.
const bcrypt = require("bcrypt");

// User model bevat database functies voor users.
const userModel = require("../models/userModel");

/*
  GET /login
  Toont de login pagina.
*/
function showLogin(req, res) {
  res.render("login", {
    error: null,
    user: null,
    page: "login",
  });
}

/*
  POST /login
  Verwerkt het login formulier.
*/
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Basis validatie: email en wachtwoord zijn verplicht.
    if (!email || !password) {
      return res.status(400).render("login", {
        error: "Vul email en wachtwoord in.",
        user: null,
        page: "login",
      });
    }

    // Zoekt gebruiker op in de database.
    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(401).render("login", {
        error: "Gebruiker bestaat niet.",
        user: null,
        page: "login",
      });
    }

    // Vergelijkt het ingevulde wachtwoord met de bcrypt hash in de database.
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).render("login", {
        error: "Wachtwoord is onjuist.",
        user: null,
        page: "login",
      });
    }

    /*
      Sessie opslaan:
      Vanaf nu weet de app wie is ingelogd.
      Let op: we slaan nooit password_hash op in de sessie.
    */
    req.session.user = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log("Logged in user:", req.session.user);

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);

    return res.status(500).render("login", {
      error: "Serverfout, probeer opnieuw.",
      user: null,
      page: "login",
    });
  }
}

/*
  GET /register
  Toont de registratiepagina.
*/
function showRegister(req, res) {
  res.render("register", {
    error: null,
    user: null,
  });
}

/*
  POST /register
  Verwerkt het registratieformulier.
*/
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Alle velden zijn verplicht.
    if (!name || !email || !password) {
      return res.status(400).render("register", {
        error: "Vul alle velden in.",
        user: null,
      });
    }

    // Controleert of email al bestaat.
    const exists = await userModel.findByEmail(email);

    if (exists) {
      return res.status(409).render("register", {
        error: "Email bestaat al.",
        user: null,
      });
    }

    // Wachtwoord veilig hashen voordat het naar de database gaat.
    const passwordHash = await bcrypt.hash(password, 10);

    // Gebruiker aanmaken in de database.
    await userModel.createUser({
      name,
      email,
      passwordHash,
    });

    return res.redirect("/login");
  } catch (err) {
    console.error(err);

    return res.status(500).render("register", {
      error: "Serverfout, probeer opnieuw.",
      user: null,
    });
  }
}

/*
  POST /logout
  Verwijdert de sessie en stuurt gebruiker terug naar login.
*/
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/dashboard");
    }

    // Verwijdert de sessie-cookie uit de browser.
    res.clearCookie("connect.sid");
    return res.redirect("/login");
  });
}

module.exports = {
  showLogin,
  login,
  showRegister,
  register,
  logout,
};
