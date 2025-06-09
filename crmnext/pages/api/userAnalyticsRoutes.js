const express = require("express");
const router = express.Router();
const UserAnalytics = require("../models/UserAnalytics");

// ✅ Fetch User Analytics Data
router.get("/user-analytics", async (req, res) => {
  try {
    const analytics = await UserAnalytics.find();
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({ message: "Error retrieving user analytics" });
  }
});

module.exports = router;
