const express = require("express");
const router = express.Router();
const TerritoryHeadTransactions = require("../models/TerritoryHeadTransactions");

// ✅ Fetch Territory Head Transactions
router.get("/territory-head-transactions", async (req, res) => {
  try {
    const transactions = await TerritoryHeadTransactions.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching territory head transactions:", error);
    res.status(500).json({ message: "Error retrieving transactions" });
  }
});

module.exports = router;
