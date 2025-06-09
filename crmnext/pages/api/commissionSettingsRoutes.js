const express = require("express");
const router = express.Router();
const CommissionSettings = require("../models/CommissionSettings");

// ✅ Fetch Commission Settings
router.get("/commission-settings", async (req, res) => {
  try {
    const settings = await CommissionSettings.find();
    res.json(settings);
  } catch (error) {
    console.error("Error fetching commission settings:", error);
    res.status(500).json({ message: "Error retrieving commission settings" });
  }
});

// ✅ Update Commission Settings
router.put("/commission-settings/update", async (req, res) => {
  try {
    for (const [role, commissionRate] of Object.entries(req.body)) {
      await CommissionSettings.findOneAndUpdate({ role }, { commissionRate });
    }
    res.json({ message: "Commission settings updated successfully" });
  } catch (error) {
    console.error("Error updating commission settings:", error);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

module.exports = router;
