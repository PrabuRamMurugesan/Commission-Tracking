const express = require("express");
const router = express.Router();

// ✅ Fetch Available Vendors
router.get("/marketplace/vendors", async (req, res) => {
  try {
    const vendors = [
      { name: "Gold Traders Ltd.", category: "Jewelry", rating: 4.8 },
      { name: "Luxury Watches", category: "Watches", rating: 4.5 },
      { name: "Silver Empire", category: "Silverware", rating: 4.2 },
    ];
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Error retrieving vendor data" });
  }
});

module.exports = router;
