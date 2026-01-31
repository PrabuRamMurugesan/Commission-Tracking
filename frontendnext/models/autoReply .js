const mongoose = require("mongoose");

const AutoReplySchema = new mongoose.Schema({
  queryType: { type: String, enum: ["General", "Technical", "Billing", "Support"], required: true },
  triggerKeywords: { type: [String], required: true }, // List of keywords that trigger auto-replies
  aiResponse: { type: String, required: true }, // AI-generated response
  priorityLevel: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  escalationRequired: { type: Boolean, default: false }, // Determines if human agent intervention is needed
  escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
  responseTime: { type: Number, default: null }, // AI response time in milliseconds
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AutoReply = mongoose.model("AutoReply", AutoReplySchema);
module.exports = AutoReply;
