// routes/aiSalesOptimizerRoutes.js
const express = require("express");
const { getSalesOptimizationData } = require("../controllers/aiSalesOptimizerController");
const router = express.Router();

router.get("/", getSalesOptimizationData);

module.exports = router;
