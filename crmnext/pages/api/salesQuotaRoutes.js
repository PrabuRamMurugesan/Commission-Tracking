const express = require("express");
const router = express.Router();

// ✅ Corrected Sales Quota API Route
router.get("/sales-quota/tracker", async (req, res) => {
  try {
    const quotaData = [
      { agentName: "John Doe", sales: 12000, target: 15000 },
      { agentName: "Jane Smith", sales: 8000, target: 12000 },
      { agentName: "Alex Johnson", sales: 5000, target: 9000 },
    ];
    res.json(quotaData);
  } catch (error) {
    console.error("Sales Quota Error:", error);
    res.status(500).json({ message: "Error retrieving sales quota" });
  }
});

module.exports = router;
