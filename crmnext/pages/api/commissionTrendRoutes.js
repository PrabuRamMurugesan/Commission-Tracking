const express = require("express");
const router = express.Router();
const CommissionTrend = require("../models/CommissionTrend");

// ✅ Fetch Commission Trend Data
router.get("/commission-trends", async (req, res) => {
  try {
    const trends = await CommissionTrend.find();
    res.json(trends);
  } catch (error) {
    console.error("Error fetching commission trends:", error);
    res.status(500).json({ message: "Error retrieving commission trends" });
  }
});

module.exports = router;
