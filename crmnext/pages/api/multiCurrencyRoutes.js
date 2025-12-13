const express = require("express");
const router = express.Router();
const MultiCurrency = require("../models/MultiCurrency");

// ✅ Fetch Supported Currencies
router.get("/multi-currency", async (req, res) => {
  try {
    const currencies = await MultiCurrency.find();
    res.json(currencies);
  } catch (error) {
    console.error("Error fetching currencies:", error);
    res.status(500).json({ message: "Error retrieving currency data" });
  }
});

module.exports = router;
