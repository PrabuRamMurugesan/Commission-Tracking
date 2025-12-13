// routes/automatedLeadGenerationRoutes.js
const express = require("express");
const { getAutomatedLeads } = require("../controllers/automatedLeadGenerationController");
const router = express.Router();

router.get("/", getAutomatedLeads);

module.exports = router;
