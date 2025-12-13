const mongoose = require("mongoose");

const AIPerformanceOptimizationSchema = new mongoose.Schema({
  optimizationId: { type: String, required: true, unique: true },
  metric: { type: String, required: true }, // CPU, Memory, API Latency, Database Queries
  detectedIssue: { type: String, required: true }, // Description of the bottleneck
  severity: { type: String, enum: ["Critical", "High", "Medium", "Low"], default: "Medium" },
  suggestedOptimization: { type: String, required: true }, // AI-recommended fix
  autoScalingTriggered: { type: Boolean, default: false }, // AI determines if auto-scaling is needed
  loadBalancingAdjustment: { type: Boolean, default: false }, // AI modifies load distribution dynamically
  systemImpactScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-assigned impact rating
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AIPerformanceOptimization = mongoose.model("AIPerformanceOptimization", AIPerformanceOptimizationSchema);
module.exports = AIPerformanceOptimization;
