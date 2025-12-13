const express = require("express");
const router = express.Router();
const CommissionPayout = require("../models/CommissionPayout");

// ✅ Fetch Payout History
router.get("/commission-payouts", async (req, res) => {
  try {
    const payouts = await CommissionPayout.find();
    res.json(payouts);
  } catch (error) {
    console.error("Error fetching commission payouts:", error);
    res.status(500).json({ message: "Error retrieving payouts" });
  }
});

// ✅ Request New Payout
router.post("/commission-payouts/request", async (req, res) => {
  const { amount, method } = req.body;
  try {
    const newPayout = new CommissionPayout({ amount, method, status: "Pending", date: new Date() });
    await newPayout.save();
    res.status(201).json({ message: "Payout request submitted" });
  } catch (error) {
    console.error("Error requesting payout:", error);
    res.status(500).json({ message: "Payout request failed" });
  }
});

module.exports = router;
