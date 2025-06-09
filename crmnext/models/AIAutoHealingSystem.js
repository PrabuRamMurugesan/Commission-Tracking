const mongoose = require("mongoose");

const AIAutoHealingSystemSchema = new mongoose.Schema({
  healingId: { type: String, required: true, unique: true },
  affectedService: { type: String, required: true }, // Service or component affected
  detectedIssue: { type: String, required: true }, // AI identifies issue (e.g., "Memory Leak", "High CPU Usage")
  severity: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
  selfHealingApplied: { type: Boolean, default: false }, // AI determines if a fix was applied
  recoveryAction: { type: String, required: false }, // Restart, Rollback, Patch Applied
  systemImpactScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-assigned impact rating
  failoverTriggered: { type: Boolean, default: false }, // AI triggers backup server if needed
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AIAutoHealingSystem = mongoose.model("AIAutoHealingSystem", AIAutoHealingSystemSchema);
module.exports = AIAutoHealingSystem;
