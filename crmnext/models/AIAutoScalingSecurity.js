const mongoose = require("mongoose");

const AIAutoScalingSecuritySchema = new mongoose.Schema({
  securityId: { type: String, required: true, unique: true },
  cloudProvider: { type: String, required: true }, // AWS, Azure, Google Cloud, etc.
  detectedThreat: { type: Boolean, default: false }, // AI flags potential security risks
  anomalyType: { type: String, required: false }, // Examples: "Unauthorized Access", "DDoS Attack", "Data Breach"
  firewallAdjusted: { type: Boolean, default: false }, // AI automatically modifies firewall rules
  accessControlUpdated: { type: Boolean, default: false }, // AI enforces RBAC modifications
  ipsTriggered: { type: Boolean, default: false }, // AI activates Intrusion Prevention System (IPS)
  riskScore: { type: Number, min: 0, max: 100, required: true }, // AI assigns a security risk score
  mitigationAction: { type: String, required: false }, // Auto-scaling lockdown, notification sent, etc.
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AIAutoScalingSecurity = mongoose.model("AIAutoScalingSecurity", AIAutoScalingSecuritySchema);
module.exports = AIAutoScalingSecurity;
