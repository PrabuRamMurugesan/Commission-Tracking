const express = require("express");
const router = express.Router();
const PerformanceAnalytics = require("../models/PerformanceAnalytics");

// ✅ Fetch Performance Analytics Data
router.get("/performance-analytics", async (req, res) => {
  try {
    const analyticsData = await PerformanceAnalytics.find();
    res.json(analyticsData);
  } catch (error) {
    console.error("Error fetching performance analytics:", error);
    res.status(500).json({ message: "Error retrieving performance analytics" });
  }
});

module.exports = router;
