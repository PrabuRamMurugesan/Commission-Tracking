const express = require("express");
const router = express.Router();
const RevenueBreakdown = require("../models/RevenueBreakdown");

// ✅ Fetch Revenue Breakdown Data
router.get("/revenue-breakdown", async (req, res) => {
  try {
    const revenueData = await RevenueBreakdown.find();
    res.json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue breakdown:", error);
    res.status(500).json({ message: "Error retrieving revenue breakdown" });
  }
});

module.exports = router;
