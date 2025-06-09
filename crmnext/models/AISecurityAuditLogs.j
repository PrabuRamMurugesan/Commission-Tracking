const mongoose = require("mongoose");

const AISecurityAuditLogsSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  actionType: { type: String, required: true }, // e.g., Login, Payment, Data Access, System Change
  status: { type: String, enum: ["Success", "Failed", "Blocked"], required: true },
  ipAddress: { type: String, required: true },
  geoLocation: { type: String, required: false }, // AI detects location from IP
  deviceInfo: { type: String, required: false }, // AI tracks device/browser info
  riskScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-determined security risk score
  detectedAnomaly: { type: Boolean, default: false }, // AI flags unusual activities
  actionTaken: { type: String, enum: ["None", "Alert Sent", "Account Locked", "Escalated"], default: "None" }, // AI auto-response
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const AISecurityAuditLogs = mongoose.model("AISecurityAuditLogs", AISecurityAuditLogsSchema);
module.exports = AISecurityAuditLogs;
