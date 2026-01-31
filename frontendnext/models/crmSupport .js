const mongoose = require("mongoose");

const CRMSupportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ticketId: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  issueType: { type: String, enum: ["Technical", "Billing", "General Inquiry", "Fraud Report"], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["Open", "In Progress", "Resolved", "Escalated"], default: "Open" },
  priorityLevel: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  sentimentAnalysis: { type: String, enum: ["Neutral", "Negative", "Severe"], default: "Neutral" },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null }, // Assigned agent for issue resolution
  resolutionNotes: { type: String, default: "" },
  resolutionTimeEstimate: { type: Number, default: null }, // Estimated resolution time in hours
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CRMSupport = mongoose.model("CRMSupport", CRMSupportSchema);
module.exports = CRMSupport;
