const express = require("express");
const router = express.Router();
const SupportTickets = require("../models/SupportTickets");

// ✅ Fetch Support Tickets
router.get("/support-tickets", async (req, res) => {
  try {
    const tickets = await SupportTickets.find().sort({ date: -1 });
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    res.status(500).json({ message: "Error retrieving tickets" });
  }
});

// ✅ Add New Support Ticket
router.post("/support-tickets/add", async (req, res) => {
  try {
    const { subject, description } = req.body;
    const newTicket = new SupportTickets({ subject, description });
    await newTicket.save();
    res.json({ message: "Support ticket submitted successfully" });
  } catch (error) {
    console.error("Error adding support ticket:", error);
    res.status(500).json({ message: "Failed to submit ticket" });
  }
});

module.exports = router;
