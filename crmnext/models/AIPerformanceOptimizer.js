const mongoose = require("mongoose");

const AIPerformanceOptimizerSchema = new mongoose.Schema({
  optimizerId: { type: String, required: true, unique: true },
  component: { type: String, required: true }, // Examples: "Server", "Database", "Network"
  currentLoad: { type: Number, min: 0, max: 100, required: true }, // Current system load percentage
  optimizationAction: { type: String, required: false }, // AI-suggested action: Scale Up, Adjust Caching, Load Balance
  responseTime: { type: Number, required: true }, // Measured in milliseconds
  trafficLoad: { type: Number, required: true }, // Number of concurrent users or requests
  autoScalingTriggered: { type: Boolean, default: false }, // Whether AI triggered auto-scaling
  cacheOptimized: { type: Boolean, default: false }, // If AI optimized caching for speed
  latencyImprovement: { type: Number, required: false }, // % improvement in latency
  lastOptimized: { type: Date, default: Date.now },
}, { timestamps: true });

const AIPerformanceOptimizer = mongoose.model("AIPerformanceOptimizer", AIPerformanceOptimizerSchema);
module.exports = AIPerformanceOptimizer;
