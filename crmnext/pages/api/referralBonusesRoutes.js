const express = require("express");
const router = express.Router();
const ReferralBonuses = require("../models/ReferralBonuses");

// ✅ Fetch Referral Bonuses
router.get("/referral-bonuses", async (req, res) => {
  try {
    const bonuses = await ReferralBonuses.find();
    res.json(bonuses);
  } catch (error) {
    console.error("Error fetching referral bonuses:", error);
    res.status(500).json({ message: "Error retrieving referral bonuses" });
  }
});

module.exports = router;
