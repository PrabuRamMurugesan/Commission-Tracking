const express = require("express");
const router = express.Router();
const RevenueTracking = require("../models/RevenueTracking");

// ✅ Fetch Revenue Data
router.get("/revenue-tracking", async (req, res) => {
  try {
    const revenueData = await RevenueTracking.find();
    res.json(revenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ message: "Error retrieving revenue data" });
  }
});

module.exports = router;
