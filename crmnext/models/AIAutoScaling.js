const mongoose = require("mongoose");

const AIAutoScalingSchema = new mongoose.Schema({
  scalingId: { type: String, required: true, unique: true },
  instanceType: { type: String, required: true }, // Examples: "Web Server", "Database Server", "Load Balancer"
  currentLoad: { type: Number, min: 0, max: 100, required: true }, // Current resource load percentage
  scalingAction: { type: String, required: false }, // AI-suggested action: Scale Up, Scale Down, Maintain
  predictedTrafficSpike: { type: Boolean, default: false }, // AI forecast for an upcoming surge in traffic
  resourceAllocated: { type: Number, required: false }, // Number of additional servers or resources allocated
  autoScalingTriggered: { type: Boolean, default: false }, // Whether AI initiated auto-scaling
  estimatedCostReduction: { type: Number, required: false }, // Estimated percentage cost saved
  lastScaled: { type: Date, default: Date.now },
}, { timestamps: true });

const AIAutoScaling = mongoose.model("AIAutoScaling", AIAutoScalingSchema);
module.exports = AIAutoScaling;
