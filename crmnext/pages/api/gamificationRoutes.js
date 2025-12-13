const express = require("express");
const router = express.Router();

// ✅ Corrected Leaderboard API Route
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = [
      { name: "John Doe", sales: 15000, commission: 2500 },
      { name: "Jane Smith", sales: 12000, commission: 2000 },
      { name: "Alex Johnson", sales: 9000, commission: 1500 },
    ];
    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ message: "Error retrieving leaderboard" });
  }
});

module.exports = router;
