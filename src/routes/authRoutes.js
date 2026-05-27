// Express router gebruikt aparte routebestanden zodat app.js overzichtelijk blijft.
const express = require("express");
const router = express.Router();

// Controller met de echte login/register/logout logica.
const auth = require("../controllers/authController");

// Startpagina stuurt gebruikers direct naar login.
router.get("/", (req, res) => res.redirect("/login"));

// Login pagina tonen.
router.get("/login", auth.showLogin);

// Login formulier verwerken.
router.post("/login", auth.login);

// Register pagina tonen.
router.get("/register", auth.showRegister);

// Register formulier verwerken.
router.post("/register", auth.register);

// Uitloggen.
router.post("/logout", auth.logout);

// Exporteert de router zodat app.js hem kan gebruiken.
module.exports = router;
