const express = require("express");
const router = express.Router();
const ReferralTransactions = require("../models/ReferralTransactions");

// ✅ Fetch Transactions
router.get("/referral-transactions", async (req, res) => {
  try {
    const transactions = await ReferralTransactions.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error retrieving transactions" });
  }
});

// ✅ Request Payout
router.post("/referral-request-payout", async (req, res) => {
  try {
    res.status(200).json({ message: "Payout request submitted successfully" });
  } catch (error) {
    console.error("Error processing payout request:", error);
    res.status(500).json({ message: "Error processing payout request" });
  }
});

module.exports = router;
