// routes/aiBehaviorAnalysisRoutes.js
const express = require("express");
const { getBehaviorData } = require("../controllers/aiBehaviorAnalysisController");
const router = express.Router();

router.get("/", getBehaviorData);

module.exports = router;
