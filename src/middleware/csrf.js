/*
  CSRF bescherming:
  CSRF staat voor Cross-Site Request Forgery.
  Hiermee voorkomen we dat een externe website zomaar POST requests naar onze app kan sturen.
*/
const Tokens = require("csrf");
const tokens = new Tokens();

/*
  ensureSecret:
  Elke sessie krijgt één geheime CSRF secret.
  Daarmee worden tokens aangemaakt en gecontroleerd.
*/
function ensureSecret(req) {
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = tokens.secretSync();
  }
}

/*
  csrfMiddleware:
  Maakt een token en zet die in res.locals.
  Daardoor kunnen EJS views csrfToken gebruiken in formulieren.
*/
function csrfMiddleware(req, res, next) {
  ensureSecret(req);
  res.locals.csrfToken = tokens.create(req.session.csrfSecret);
  next();
}

/*
  csrfProtect:
  Controleert bij POST/PUT/DELETE of het formulier een geldige _csrf token meestuurt.
*/
function csrfProtect(req, res, next) {
  const method = req.method.toUpperCase();

  // GET requests veranderen geen data, dus die hoeven niet gecontroleerd te worden.
  if (!["POST", "PUT", "DELETE"].includes(method)) {
    return next();
  }

  ensureSecret(req);

  // Token kan komen uit body of headers.
  const sent =
    req.body?._csrf ||
    req.headers["x-csrf-token"] ||
    req.headers["csrf-token"];

  if (!sent) {
    return res.status(403).send("CSRF token missing.");
  }

  // Vergelijkt ontvangen token met de secret van de sessie.
  const ok = tokens.verify(req.session.csrfSecret, sent);

  if (!ok) {
    return res.status(403).send("CSRF token invalid.");
  }

  next();
}

module.exports = {
  csrfMiddleware,
  csrfProtect,
};
