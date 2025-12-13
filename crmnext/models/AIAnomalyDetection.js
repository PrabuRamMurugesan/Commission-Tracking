const mongoose = require("mongoose");

const AIAnomalyDetectionSchema = new mongoose.Schema({
  anomalyId: { type: String, required: true, unique: true },
  detectedAnomaly: { type: Boolean, default: false }, // AI flags unusual behavior
  anomalyType: { type: String, required: false }, // Examples: "Fraudulent Transaction", "Unauthorized Login", "CPU Spike"
  riskLevel: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
  affectedSystem: { type: String, required: false }, // Database, API, Cloud Instance, User Account
  mitigationAction: { type: String, required: false }, // AI's recommended action (e.g., Freeze Account, Notify Admin)
  logsAnalyzed: { type: Number, required: false }, // Total logs AI analyzed to detect anomalies
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const AIAnomalyDetection = mongoose.model("AIAnomalyDetection", AIAnomalyDetectionSchema);
module.exports = AIAnomalyDetection;
