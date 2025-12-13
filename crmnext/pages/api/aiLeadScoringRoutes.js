// routes/aiLeadScoringRoutes.js
const express = require("express");
const { getLeadScoring } = require("../controllers/aiLeadScoringController");
const router = express.Router();

router.get("/", getLeadScoring);

module.exports = router;
