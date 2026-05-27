// Express is het webframework waarmee we routes, middleware en views kunnen gebruiken.
const express = require("express");

// Path helpt om veilige absolute paden te maken naar folders zoals views en public.
const path = require("path");

// Helmet voegt basis security headers toe aan de app.
const helmet = require("helmet");

// Morgan logt elke request in de terminal, bijvoorbeeld GET /dashboard 200.
const morgan = require("morgan");

// express-session wordt gebruikt om ingelogde gebruikers te onthouden.
const session = require("express-session");

// express-mysql-session zorgt dat sessies in MySQL worden opgeslagen.
const MySQLStore = require("express-mysql-session")(session);

// CSRF middleware beschermt POST formulieren tegen ongewenste externe requests.
const { csrfMiddleware, csrfProtect } = require("./middleware/csrf");

// Routes voor login, register en logout.
const authRoutes = require("./routes/authRoutes");

// Routes voor dashboard, meldingen en admin panel.
const meldingRoutes = require("./routes/meldingRoutes");

// Maakt de Express applicatie aan.
const app = express();

/*
  Algemene middleware:
  - helmet: security headers
  - morgan: request logging
  - express.urlencoded: formulierdata lezen uit req.body
*/
app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

/*
  View engine configuratie:
  We gebruiken EJS zodat we HTML kunnen combineren met JavaScript variabelen.
*/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/*
  Public folder:
  Hier staan CSS, images en andere statische bestanden.
  Bijvoorbeeld /css/style.css verwijst naar src/public/css/style.css
*/
app.use(express.static(path.join(__dirname, "public")));

/*
  Session store:
  De login sessie wordt opgeslagen in MySQL.
  Daardoor blijft de gebruiker ingelogd zolang de sessie geldig is.
*/
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/*
  Session instellingen:
  - key: naam van de cookie in de browser
  - secret: geheime sleutel om sessies te beveiligen
  - store: MySQL session store
  - httpOnly: JavaScript in de browser kan de cookie niet uitlezen
  - sameSite: helpt tegen CSRF aanvallen
*/
app.use(
  session({
    key: "fixit.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

/*
  res.locals.user:
  Hiermee is de ingelogde user beschikbaar in alle EJS views.
  Bijvoorbeeld in header.ejs kunnen we controleren of user bestaat.
*/
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

/*
  CSRF:
  Eerst wordt er een token aangemaakt.
  Daarna worden POST/PUT/DELETE requests gecontroleerd.
*/
app.use(csrfMiddleware);
app.use(csrfProtect);

/*
  Routes koppelen:
  Alle auth routes en melding routes starten vanaf "/".
*/
app.use("/", authRoutes);
app.use("/", meldingRoutes);

/*
  Centrale error handler:
  Als er ergens een error ontstaat, wordt die hier opgevangen.
*/
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error.");
});

// Exporteert de app zodat server.js hem kan starten.
module.exports = app;
