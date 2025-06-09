const mongoose = require("mongoose");

const AISuspiciousActivityMonitorSchema = new mongoose.Schema({
  activityId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
  activityType: { type: String, required: true }, // Examples: "Failed Login", "API Abuse", "Unauthorized Access"
  riskScore: { type: Number, min: 0, max: 100, required: true }, // AI-assigned risk score
  detectedAnomaly: { type: Boolean, default: false }, // AI flags suspicious activity
  mitigationAction: { type: String, required: false }, // Lock Account, Notify Admin, Force Password Reset
  locationMismatch: { type: Boolean, default: false }, // If user's IP location does not match usual activity
  deviceMismatch: { type: Boolean, default: false }, // If the device used is different from usual devices
  timestamps: { type: Date, default: Date.now },
}, { timestamps: true });

const AISuspiciousActivityMonitor = mongoose.model("AISuspiciousActivityMonitor", AISuspiciousActivityMonitorSchema);
module.exports = AISuspiciousActivityMonitor;
