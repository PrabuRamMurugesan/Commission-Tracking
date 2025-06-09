// routes/aiThreatDetectionRoutes.js
const express = require("express");
const { getThreatData, mitigateThreat } = require("../controllers/aiThreatDetectionController");
const router = express.Router();

router.get("/", getThreatData);
router.post("/mitigate", mitigateThreat);

module.exports = router;
