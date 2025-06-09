const express = require("express");
const router = express.Router();

// ✅ Franchise Performance Route
router.get("/performance/franchises", async (req, res) => {
    try {
      const data = [
        { name: "Franchise X", sales: 50000, commission: 10000, growth: 12 },
        { name: "Franchise Y", sales: 35000, commission: 7500, growth: 9 },
      ];
      res.json(data);
    } catch (error) {
      console.error("Error fetching franchise performance:", error);
      res.status(500).json({ message: "Error retrieving franchise data" });
    }
  });

// Mock Data for Territory Head Performance
router.get("/performance/territory-head", async (req, res) => {
  try {
    const data = [
      { territory: "North Zone", sales: 20000, commission: 5000, conversionRate: 12 },
      { territory: "South Zone", sales: 15000, commission: 3500, conversionRate: 10 },
      { territory: "East Zone", sales: 18000, commission: 4200, conversionRate: 11 },
    ];
    res.json(data);
  } catch (error) {
    console.error("Error fetching performance:", error);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// ✅ Agent Performance Route
router.get("/performance/agents", async (req, res) => {
    try {
      const data = [
        { name: "Agent A", sales: 14000, commission: 2800, conversionRate: 10 },
        { name: "Agent B", sales: 11000, commission: 2200, conversionRate: 8 },
      ];
      res.json(data);
    } catch (error) {
      console.error("Error fetching agent performance:", error);
      res.status(500).json({ message: "Error retrieving data" });
    }
  });

// Mock Data for Vendor Performance
router.get("/performance/vendors", async (req, res) => {
  try {
    const data = [
      { name: "Vendor A", sales: 12000, commission: 2500, topProduct: "Gold Necklace" },
      { name: "Vendor B", sales: 9000, commission: 1800, topProduct: "Diamond Ring" },
      { name: "Vendor C", sales: 15000, commission: 3200, topProduct: "Silver Bracelet" },
    ];
    res.json(data);
  } catch (error) {
    console.error("Error fetching vendor performance:", error);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// ✅ Customer Become a Vendor Performance Route
router.get("/performance/customer-vendor", async (req, res) => {
    try {
      const data = [
        { name: "Alice Brown", sales: 10000, commission: 2200, conversionRate: 15 },
        { name: "David Clark", sales: 8500, commission: 1800, conversionRate: 12 },
      ];
      res.json(data);
    } catch (error) {
      console.error("Error fetching vendor performance:", error);
      res.status(500).json({ message: "Error retrieving data" });
    }
  });
  
  // ✅ Referral Performance Route
  router.get("/performance/referrals", async (req, res) => {
    try {
      const data = [
        { referrer: "Mark Lee", sales: 12000, commission: 2400, successfulReferrals: 8 },
        { referrer: "Sophia Turner", sales: 9500, commission: 1900, successfulReferrals: 6 },
      ];
      res.json(data);
    } catch (error) {
      console.error("Error fetching referral performance:", error);
      res.status(500).json({ message: "Error retrieving referral data" });
    }
  });
  

module.exports = router;
