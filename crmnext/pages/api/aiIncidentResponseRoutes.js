// routes/aiIncidentResponseRoutes.js
const express = require("express");
const { getIncidentReports, resolveIncidents } = require("../controllers/aiIncidentResponseController");
const router = express.Router();

router.get("/", getIncidentReports);
router.post("/resolve", resolveIncidents);

module.exports = router;
