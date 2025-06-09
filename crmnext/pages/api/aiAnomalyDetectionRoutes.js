// routes/aiAnomalyDetectionRoutes.js
const express = require("express");
const { getAnomalyData, resolveAnomaly } = require("../controllers/aiAnomalyDetectionController");
const router = express.Router();

router.get("/", getAnomalyData);
router.post("/resolve", resolveAnomaly);

module.exports = router;
