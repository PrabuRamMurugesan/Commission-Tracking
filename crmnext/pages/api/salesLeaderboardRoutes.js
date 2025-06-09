const express = require("express");
const router = express.Router();
const SalesLeaderboard = require("../models/SalesLeaderboard");

// ✅ Fetch Sales Leaderboard Data
router.get("/sales-leaderboard", async (req, res) => {
  try {
    const leaderboard = await SalesLeaderboard.find().sort({ totalEarnings: -1 });
    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching sales leaderboard:", error);
    res.status(500).json({ message: "Error retrieving leaderboard data" });
  }
});

module.exports = router;
