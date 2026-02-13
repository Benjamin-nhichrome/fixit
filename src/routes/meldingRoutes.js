const express = require("express");
const router = express.Router();
const meld = require("../controllers/meldingController");
const { requireLogin, requireAdmin } = require("../middleware/auth");

router.get("/dashboard", requireLogin, meld.dashboard);

router.get("/melding/nieuw", requireLogin, meld.showNew);
router.post("/melding/nieuw", requireLogin, meld.create);

router.get("/admin", requireLogin, requireAdmin, meld.adminPanel);
router.post("/admin/melding/:id/status", requireLogin, requireAdmin, meld.updateStatus);

module.exports = router;
