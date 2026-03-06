const meldingen = require("../models/meldingModel");

exports.dashboard = async (req, res) => {
  const rows = await meldingen.listByUser(req.session.user.id);
  res.render("dashboard", { meldingen: rows });
};

exports.showNew = (req, res) => res.render("melding_new", { errors: [] });

exports.create = async (req, res) => {
  const { categorie, omschrijving, locatie } = req.body;

  if (!categorie || !omschrijving || !locatie) {
    return res.status(400).render("melding_new", { errors: ["Alle velden zijn verplicht."] });
  }

  await meldingen.createMelding(req.session.user.user_id, categorie, omschrijving, locatie);
  res.redirect("/dashboard");
};

exports.adminPanel = async (req, res, next) => {
  try {
    const items = await meldingen.listAll();
    const counts = await meldingen.getStatusCounts();

    res.render("admin", { items, counts });
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ["open", "in_behandeling", "opgelost", "gesloten"];

  if (!allowed.includes(status)) return res.status(400).send("Invalid status");

  await meldingen.updateStatus(req.params.id, status);
  res.redirect("/admin");
};
