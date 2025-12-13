// routes/aiTaxCalculationRoutes.js
const express = require("express");
const { getTaxCalculations } = require("../controllers/aiTaxCalculationController");
const router = express.Router();

router.get("/", getTaxCalculations);

module.exports = router;
