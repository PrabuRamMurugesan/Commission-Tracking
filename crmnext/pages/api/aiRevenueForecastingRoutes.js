// routes/aiRevenueForecastingRoutes.js
const express = require("express");
const { getAIRevenueForecasting } = require("../controllers/aiRevenueForecastingController");
const router = express.Router();

router.get("/", getAIRevenueForecasting);

module.exports = router;
