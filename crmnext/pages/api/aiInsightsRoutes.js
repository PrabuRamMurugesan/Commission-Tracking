const express = require("express");
const router = express.Router();

// Mock AI Prediction Data
router.get("/predictions", async (req, res) => {
  try {
    const salesData = [
      { month: "Jan", actual: 5000, predicted: 5300 },
      { month: "Feb", actual: 6200, predicted: 6400 },
      { month: "Mar", actual: 7000, predicted: 7200 },
      { month: "Apr", actual: 7800, predicted: 8000 },
    ];

    const commissionData = [
      { month: "Jan", actual: 500, predicted: 520 },
      { month: "Feb", actual: 620, predicted: 650 },
      { month: "Mar", actual: 700, predicted: 730 },
      { month: "Apr", actual: 780, predicted: 810 },
    ];

    res.json({ sales: salesData, commissions: commissionData });
  } catch (error) {
    console.error("AI Insights Error:", error);
    res.status(500).json({ message: "Error retrieving AI insights" });
  }
});

module.exports = router;
