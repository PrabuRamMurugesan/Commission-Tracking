const express = require("express");
const router = express.Router();
const UserFeedback = require("../models/UserFeedback");

// ✅ Fetch User Feedback
router.get("/user-feedback", async (req, res) => {
  try {
    const feedbacks = await UserFeedback.find().sort({ date: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    res.status(500).json({ message: "Error retrieving feedback" });
  }
});

// ✅ Add New User Feedback
router.post("/user-feedback/add", async (req, res) => {
  try {
    const { category, message } = req.body;
    const newFeedback = new UserFeedback({ category, message });
    await newFeedback.save();
    res.json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

module.exports = router;
