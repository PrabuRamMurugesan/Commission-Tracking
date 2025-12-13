const mongoose = require("mongoose");

const AIVoiceVideoSupportSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  supportType: { type: String, enum: ["Voice", "Video"], required: true },
  issueCategory: { type: String, required: true }, // e.g., Payment Issues, Order Tracking, Technical Support
  assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
  priorityLevel: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" }, // AI determines priority
  sentimentScore: { type: Number, min: 0, max: 100, default: 50 }, // AI sentiment analysis based on tone/language
  transcription: { type: String, default: "" }, // AI-generated transcript of the session
  resolutionStatus: {
    type: String,
    enum: ["Pending", "Resolved", "Escalated"],
    default: "Pending",
  },
  callDuration: { type: Number, default: 0 }, // Duration in seconds
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const AIVoiceVideoSupport = mongoose.model("AIVoiceVideoSupport", AIVoiceVideoSupportSchema);
module.exports = AIVoiceVideoSupport;
