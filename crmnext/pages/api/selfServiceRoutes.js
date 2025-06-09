const express = require("express");
const router = express.Router();

// ✅ Fetch User Commission Data
router.get("/selfservice/commissions", async (req, res) => {
  try {
    const commissions = [
      { user: "Alice Brown", role: "Vendor", amount: 5200 },
      { user: "Mark Smith", role: "Franchise", amount: 11000 },
      { user: "Sophia Lee", role: "Agent", amount: 4300 },
    ];
    res.json(commissions);
  } catch (error) {
    console.error("Error fetching commissions:", error);
    res.status(500).json({ message: "Error retrieving commission data" });
  }
});

module.exports = router;
