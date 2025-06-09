const express = require("express");
const router = express.Router();
const Hierarchy = require("../models/Hierarchy");

// ✅ Fetch Hierarchy Performance Data
router.get("/hierarchy", async (req, res) => {
  try {
    const hierarchyData = await Hierarchy.find();
    res.json(hierarchyData);
  } catch (error) {
    console.error("Error fetching hierarchy performance:", error);
    res.status(500).json({ message: "Error retrieving hierarchy data" });
  }
});

module.exports = router;
