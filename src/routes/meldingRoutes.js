// Routes voor dashboard, meldingen en admin panel.
const express = require("express");
const router = express.Router();

// Controller met alle melding functies.
const meld = require("../controllers/meldingController");

// Middleware voor login/admin controle.
const { requireLogin, requireAdmin } = require("../middleware/auth");

/*
  Dashboard:
  Alleen ingelogde gebruikers mogen hun eigen meldingen zien.
*/
router.get("/dashboard", requireLogin, meld.dashboard);

/*
  Nieuwe melding:
  GET toont het formulier.
  POST slaat de melding op.
*/
router.get("/melding/nieuw", requireLogin, meld.showNew);
router.post("/melding/nieuw", requireLogin, meld.create);

/*
  Delete melding:
  Normale users kunnen alleen hun eigen melding verwijderen.
  Admins kunnen alle meldingen verwijderen.
  Die controle zit in meldingModel.deleteMelding().
*/
router.post("/melding/:id/delete", requireLogin, meld.deleteMelding);

/*
  Admin panel:
  requireAdmin zorgt dat alleen users met role = "admin" toegang krijgen.
*/
router.get("/admin", requireLogin, requireAdmin, meld.adminPanel);

/*
  Admin status update:
  Admin kan status veranderen naar open, in_behandeling, opgelost of gesloten.
*/
router.post(
  "/admin/melding/:id/status",
  requireLogin,
  requireAdmin,
  meld.updateStatus
);

module.exports = router;
