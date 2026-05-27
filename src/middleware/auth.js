/*
  Middleware: requireLogin
  Deze functie beschermt routes die alleen voor ingelogde gebruikers zijn.
*/
function requireLogin(req, res, next) {
  // Als er geen user in de sessie zit, is de gebruiker niet ingelogd.
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // Als user wel bestaat, mag de request doorgaan naar de controller.
  next();
}

/*
  Middleware: requireAdmin
  Deze functie beschermt admin routes.
*/
function requireAdmin(req, res, next) {
  // Geen user of geen admin role betekent geen toegang.
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("Forbidden");
  }

  // Als de gebruiker admin is, mag die doorgaan.
  next();
}

module.exports = {
  requireLogin,
  requireAdmin,
};
