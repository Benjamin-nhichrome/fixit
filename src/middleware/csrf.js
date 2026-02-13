const Tokens = require("csrf");
const tokens = new Tokens();

function ensureSecret(req) {
  if (!req.session.csrfSecret) {
    req.session.csrfSecret = tokens.secretSync();
  }
}

function csrfMiddleware(req, res, next) {
  ensureSecret(req);
  res.locals.csrfToken = tokens.create(req.session.csrfSecret);
  next();
}

function csrfProtect(req, res, next) {
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "DELETE"].includes(method)) return next();

  ensureSecret(req);

  const sent =
    req.body?._csrf ||
    req.headers["x-csrf-token"] ||
    req.headers["csrf-token"];

  if (!sent) return res.status(403).send("CSRF token missing.");

  const ok = tokens.verify(req.session.csrfSecret, sent);
  if (!ok) return res.status(403).send("CSRF token invalid.");

  next();
}

module.exports = { csrfMiddleware, csrfProtect };
