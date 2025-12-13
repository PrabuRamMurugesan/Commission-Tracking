const express = require("express");
const router = express.Router();
const VendorTransactions = require("../models/VendorTransactions");

// ✅ Fetch Vendor Transactions
router.get("/vendor-transactions", async (req, res) => {
  try {
    const transactions = await VendorTransactions.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching vendor transactions:", error);
    res.status(500).json({ message: "Error retrieving transactions" });
  }
});

// ✅ Request Payout
router.post("/vendor-request-payout", async (req, res) => {
  try {
    // Logic to process payout request (e.g., update payout status in DB)
    res.status(200).json({ message: "Payout request submitted successfully" });
  } catch (error) {
    console.error("Error processing payout request:", error);
    res.status(500).json({ message: "Error processing payout request" });
  }
});

module.exports = router;
