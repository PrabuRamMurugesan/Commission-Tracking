// routes/aiPerformanceOptimizerRoutes.js
const express = require("express");
const { getPerformanceMetrics, optimizePerformance } = require("../controllers/aiPerformanceOptimizationController");
const router = express.Router();

router.get("/", getPerformanceMetrics);
router.post("/optimize", optimizePerformance);

module.exports = router;
