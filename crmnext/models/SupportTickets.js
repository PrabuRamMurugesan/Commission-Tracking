const mongoose = require("mongoose");

const SupportTicketsSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Open", "In Progress", "Resolved"], default: "Open" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SupportTickets", SupportTicketsSchema);
