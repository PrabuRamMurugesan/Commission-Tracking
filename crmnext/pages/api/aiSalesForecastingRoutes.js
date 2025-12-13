// routes/aiSalesForecastingRoutes.js
const express = require("express");
const { getSalesForecast } = require("../controllers/aiSalesForecastingController");
const router = express.Router();

router.get("/", getSalesForecast);

module.exports = router;
