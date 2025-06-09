// routes/aiSystemPerformanceRoutes.js
const express = require("express");
const { getSystemMetrics, optimizeSystemPerformance } = require("../controllers/aiSystemPerformanceController");
const router = express.Router();

router.get("/", getSystemMetrics);
router.post("/optimize", optimizeSystemPerformance);

module.exports = router;
