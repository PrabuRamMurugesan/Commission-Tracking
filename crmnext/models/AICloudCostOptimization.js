const mongoose = require("mongoose");

const AICloudCostOptimizationSchema = new mongoose.Schema({
  costOptimizationId: { type: String, required: true, unique: true },
  cloudProvider: { type: String, required: true }, // AWS, Azure, Google Cloud, etc.
  currentCost: { type: Number, required: true }, // Current cloud expense
  predictedSavings: { type: Number, required: true }, // AI-calculated potential savings
  resourceUtilization: { type: Number, required: true }, // % of resource utilization
  recommendedScaling: { type: Boolean, default: false }, // AI suggests auto-scaling
  unusedResources: { type: Boolean, default: false }, // AI identifies idle resources
  billingAlertsEnabled: { type: Boolean, default: true }, // AI triggers cost alerts
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AICloudCostOptimization = mongoose.model("AICloudCostOptimization", AICloudCostOptimizationSchema);
module.exports = AICloudCostOptimization;
