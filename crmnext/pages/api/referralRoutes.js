const express = require("express");
const router = express.Router();
const Referral = require("../models/Referral");

// ✅ Fetch Referrals for Referral Marketplace
router.get("/referrals", async (req, res) => {
  try {
    const referrals = await Referral.find();
    res.json(referrals);
  } catch (error) {
    console.error("Error fetching referrals:", error);
    res.status(500).json({ message: "Error retrieving referrals" });
  }
});

module.exports = router;
