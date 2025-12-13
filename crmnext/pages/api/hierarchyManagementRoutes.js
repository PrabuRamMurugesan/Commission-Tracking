const express = require("express");
const router = express.Router();
const HierarchyManagement = require("../models/HierarchyManagement");

// ✅ Fetch Hierarchy Data
router.get("/hierarchy-management", async (req, res) => {
  try {
    const hierarchy = await HierarchyManagement.find();
    res.json(hierarchy);
  } catch (error) {
    console.error("Error fetching hierarchy data:", error);
    res.status(500).json({ message: "Error retrieving hierarchy data" });
  }
});

module.exports = router;
