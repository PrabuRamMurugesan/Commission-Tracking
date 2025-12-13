const mongoose = require("mongoose");

const AIDowntimePreventionSchema = new mongoose.Schema({
  preventionId: { type: String, required: true, unique: true },
  affectedService: { type: String, required: true }, // Name of service being monitored
  predictedDowntime: { type: Boolean, default: false }, // AI forecasts an upcoming issue
  issueSeverity: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
  recoveryAction: { type: String, required: false }, // Restart, Reroute Traffic, Scale Resources, etc.
  failoverTriggered: { type: Boolean, default: false }, // AI shifts traffic to backup servers if needed
  uptimePercentage: { type: Number, min: 0, max: 100, required: true }, // System uptime score
  alertSent: { type: Boolean, default: false }, // If an alert was sent to admins
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AIDowntimePrevention = mongoose.model("AIDowntimePrevention", AIDowntimePreventionSchema);
module.exports = AIDowntimePrevention;
