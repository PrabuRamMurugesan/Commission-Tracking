const express = require("express");
const router = express.Router();
const SalesForecast = require("../models/SalesForecast");

// ✅ Fetch Sales Forecast Data
router.get("/sales-forecast", async (req, res) => {
  try {
    const forecasts = await SalesForecast.find();
    res.json(forecasts);
  } catch (error) {
    console.error("Error fetching sales forecasts:", error);
    res.status(500).json({ message: "Error retrieving sales forecasts" });
  }
});

module.exports = router;
