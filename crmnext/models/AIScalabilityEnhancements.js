const mongoose = require("mongoose");

const AIScalabilityEnhancementsSchema = new mongoose.Schema({
  scaleId: { type: String, required: true, unique: true },
  serverLoad: { type: Number, required: true }, // Current server load percentage
  activeSessions: { type: Number, required: true }, // Number of users currently online
  predictedTrafficSpike: { type: Boolean, default: false }, // AI predicts if a surge is coming
  autoScalingEnabled: { type: Boolean, default: true }, // AI determines if auto-scaling should trigger
  recommendedInstances: { type: Number, required: true }, // AI suggests the number of extra instances needed
  loadBalancingOptimization: { type: Boolean, default: false }, // AI adjusts load balancing strategies
  cloudResourceCost: { type: Number, required: false }, // AI tracks resource usage cost optimization
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AIScalabilityEnhancements = mongoose.model("AIScalabilityEnhancements", AIScalabilityEnhancementsSchema);
module.exports = AIScalabilityEnhancements;
