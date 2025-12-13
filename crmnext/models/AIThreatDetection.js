const mongoose = require("mongoose");

const AIThreatDetectionSchema = new mongoose.Schema({
  threatId: { type: String, required: true, unique: true },
  detectedThreat: { type: Boolean, default: false }, // AI flags potential security risks
  threatType: { type: String, required: false }, // Examples: "Malware", "DDoS Attack", "Unauthorized Access"
  riskLevel: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
  mitigationAction: { type: String, required: false }, // Isolate, Notify Admin, Auto-Patch
  affectedSystem: { type: String, required: false }, // Database, Server, User Account
  automatedResponseTriggered: { type: Boolean, default: false }, // AI executed security response
  logsAnalyzed: { type: Number, required: false }, // Count of system logs analyzed for threats
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AIThreatDetection = mongoose.model("AIThreatDetection", AIThreatDetectionSchema);
module.exports = AIThreatDetection;
