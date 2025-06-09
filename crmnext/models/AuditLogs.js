const mongoose = require("mongoose");

const AuditLogsSchema = new mongoose.Schema({
  user: { type: String, required: true },
  role: { type: String, enum: ["Admin", "Franchise", "Territory Head", "Agent", "Vendor", "Referral"], required: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AuditLogs", AuditLogsSchema);
