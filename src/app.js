const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const { csrfMiddleware, csrfProtect } = require("./middleware/csrf");

const authRoutes = require("./routes/authRoutes");
const meldingRoutes = require("./routes/meldingRoutes");

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Sessions in MySQL
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.use(
  session({
    key: "fixit.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use(csrfMiddleware);
app.use(csrfProtect);

app.use("/", authRoutes);
app.use("/", meldingRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error.");
});

module.exports = app;
