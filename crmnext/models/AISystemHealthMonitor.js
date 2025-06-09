const mongoose = require("mongoose");

const AISystemHealthMonitorSchema = new mongoose.Schema({
  systemId: { type: String, required: true, unique: true },
  cpuUsage: { type: Number, min: 0, max: 100, required: true }, // CPU usage percentage
  memoryUsage: { type: Number, min: 0, max: 100, required: true }, // RAM usage percentage
  diskUsage: { type: Number, min: 0, max: 100, required: true }, // Storage usage percentage
  networkLatency: { type: Number, required: true }, // Network latency in milliseconds
  detectedAnomaly: { type: Boolean, default: false }, // AI flags abnormal system behavior
  autoHealingTriggered: { type: Boolean, default: false }, // AI initiates self-repair actions
  optimizationPerformed: { type: Boolean, default: false }, // If AI has optimized system settings
  maintenanceRequired: { type: Boolean, default: false }, // Indicates if human intervention is needed
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AISystemHealthMonitor = mongoose.model("AISystemHealthMonitor", AISystemHealthMonitorSchema);
module.exports = AISystemHealthMonitor;
