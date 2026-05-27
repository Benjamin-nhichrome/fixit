// Melding model bevat alle database functies voor meldingen.
const meldingen = require("../models/meldingModel");

/*
  Dashboard controller:
  Toont alleen de meldingen van de ingelogde gebruiker.
*/
exports.dashboard = async (req, res) => {
  const rows = await meldingen.listByUser(req.session.user.id);

  // Flash message wordt één keer getoond en daarna verwijderd.
  const flash = req.session.flash;
  delete req.session.flash;

  res.render("dashboard", {
    meldingen: rows,
    flash,
  });
};

/*
  GET /melding/nieuw
  Toont het formulier voor een nieuwe melding.
*/
exports.showNew = (req, res) => {
  res.render("melding_new", {
    errors: [],
  });
};

/*
  POST /melding/nieuw
  Slaat een nieuwe melding op in de database.
*/
exports.create = async (req, res) => {
  const { categorie, omschrijving, locatie, prioriteit } = req.body;

  // Controleert of verplichte velden zijn ingevuld.
  if (!categorie || !omschrijving || !locatie) {
    return res.status(400).render("melding_new", {
      errors: ["Alle velden zijn verplicht."],
    });
  }

  // Extra veiligheid: als er geen sessie is, terug naar login.
  if (!req.session.user) {
    return res.redirect("/login");
  }

  // Maakt melding aan en koppelt die aan req.session.user.id.
  await meldingen.createMelding(
    req.session.user.id,
    categorie,
    omschrijving,
    locatie,
    prioriteit || "normaal"
  );

  req.session.flash = "Melding succesvol aangemaakt.";
  res.redirect("/dashboard");
};

/*
  Admin panel:
  Toont alle meldingen en de status statistieken.
*/
exports.adminPanel = async (req, res) => {
  try {
    const rows = await meldingen.listAll();
    const counts = await meldingen.getStatusCounts();

    const flash = req.session.flash;
    delete req.session.flash;

    res.render("admin", {
      user: req.session.user,
      csrfToken: res.locals.csrfToken,
      meldingen: rows,
      openCount: counts.open || 0,
      inBehandelingCount: counts.in_behandeling || 0,
      opgelostCount: counts.opgelost || 0,
      flash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
};

/*
  Admin status update:
  Controleert eerst of de status toegestaan is.
*/
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["open", "in_behandeling", "opgelost", "gesloten"];

  if (!allowed.includes(status)) {
    return res.status(400).send("Invalid status");
  }

  await meldingen.updateStatus(req.params.id, status);

  req.session.flash = "Status succesvol bijgewerkt.";
  res.redirect("/admin");
};

/*
  Delete melding:
  Admin kan alles verwijderen.
  Normale users kunnen alleen hun eigen melding verwijderen.
*/
exports.deleteMelding = async (req, res) => {
  try {
    const meldingId = req.params.id;
    const userId = req.session.user.id;
    const isAdmin = req.session.user.role === "admin";

    await meldingen.deleteMelding(meldingId, userId, isAdmin);

    req.session.flash = "Melding succesvol verwijderd.";

    if (isAdmin) {
      return res.redirect("/admin");
    }

    return res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
};
