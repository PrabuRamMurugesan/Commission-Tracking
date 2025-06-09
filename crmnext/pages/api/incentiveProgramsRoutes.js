const express = require("express");
const router = express.Router();
const IncentivePrograms = require("../models/IncentivePrograms");

// ✅ Fetch Incentive Programs
router.get("/incentive-programs", async (req, res) => {
  try {
    const programs = await IncentivePrograms.find();
    res.json(programs);
  } catch (error) {
    console.error("Error fetching incentive programs:", error);
    res.status(500).json({ message: "Error retrieving incentive programs" });
  }
});

// ✅ Add New Incentive Program
router.post("/incentive-programs/add", async (req, res) => {
  try {
    const { title, description, eligibility, reward } = req.body;
    const newProgram = new IncentivePrograms({ title, description, eligibility, reward });
    await newProgram.save();
    res.json({ message: "Incentive program added successfully" });
  } catch (error) {
    console.error("Error adding incentive program:", error);
    res.status(500).json({ message: "Failed to add incentive program" });
  }
});

module.exports = router;
