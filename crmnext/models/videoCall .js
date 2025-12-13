const mongoose = require("mongoose");

const VideoCallSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null }, // Assigned agent
  issueType: { type: String, enum: ["Technical", "Billing", "Fraud Report", "General Inquiry"], required: true },
  priorityLevel: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
  status: { type: String, enum: ["Scheduled", "Ongoing", "Completed", "Cancelled"], default: "Scheduled" },
  sentimentAnalysis: { type: String, enum: ["Neutral", "Negative", "Severe"], default: "Neutral" },
  duration: { type: Number, default: null }, // Duration of the call in minutes
  callStartTime: { type: Date, default: null },
  callEndTime: { type: Date, default: null },
  recordingURL: { type: String, default: null }, // Stores recording if applicable
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const VideoCall = mongoose.model("VideoCall", VideoCallSchema);
module.exports = VideoCall;
