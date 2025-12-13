const express = require("express");
const router = express.Router();
const BonusRewards = require("../models/BonusRewards");

// ✅ Fetch Bonus Rewards Data
router.get("/bonus-rewards", async (req, res) => {
  try {
    const bonusData = await BonusRewards.find();
    res.json(bonusData);
  } catch (error) {
    console.error("Error fetching bonus rewards:", error);
    res.status(500).json({ message: "Error retrieving bonus rewards" });
  }
});

module.exports = router;
