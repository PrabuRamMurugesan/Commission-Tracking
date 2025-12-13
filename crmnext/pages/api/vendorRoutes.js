const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");

// ✅ Fetch Vendors for Marketplace
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Error retrieving vendors" });
  }
});

// ✅ Fetch Vendor Earnings
router.get("/vendors/earnings", async (req, res) => {
  try {
    const earnings = await Vendor.find().select("name sales commission payoutStatus");
    res.json(earnings);
  } catch (error) {
    console.error("Error fetching vendor earnings:", error);
    res.status(500).json({ message: "Error retrieving earnings" });
  }
});

module.exports = router;
