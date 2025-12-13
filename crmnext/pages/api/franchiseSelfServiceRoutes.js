const express = require("express");
const router = express.Router();
const FranchiseTransactions = require("../models/FranchiseTransactions");

// ✅ Fetch Franchise Transactions
router.get("/franchise-transactions", async (req, res) => {
  try {
    const transactions = await FranchiseTransactions.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching franchise transactions:", error);
    res.status(500).json({ message: "Error retrieving transactions" });
  }
});

module.exports = router;
