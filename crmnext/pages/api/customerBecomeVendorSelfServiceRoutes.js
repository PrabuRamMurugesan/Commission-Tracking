const express = require("express");
const router = express.Router();
const CustomerBecomeVendorTransactions = require("../models/CustomerBecomeVendorTransactions");

// ✅ Fetch Transactions
router.get("/customer-become-vendor-transactions", async (req, res) => {
  try {
    const transactions = await CustomerBecomeVendorTransactions.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error retrieving transactions" });
  }
});

// ✅ Request Payout
router.post("/customer-become-vendor-request-payout", async (req, res) => {
  try {
    res.status(200).json({ message: "Payout request submitted successfully" });
  } catch (error) {
    console.error("Error processing payout request:", error);
    res.status(500).json({ message: "Error processing payout request" });
  }
});

module.exports = router;
