const mongoose = require("mongoose");

const AIAutoScalingManagementSchema = new mongoose.Schema({
  scalingId: { type: String, required: true, unique: true },
  serverCluster: { type: String, required: true }, // E.g., AWS, Google Cloud, Azure
  currentUsage: { type: Number, required: true }, // Current CPU/Memory usage %
  autoScalingEnabled: { type: Boolean, default: true }, // AI determines scaling necessity
  predictedScaleUp: { type: Boolean, default: false }, // AI forecasts need for additional resources
  predictedScaleDown: { type: Boolean, default: false }, // AI suggests releasing unused resources
  recommendedInstanceCount: { type: Number, required: false }, // AI suggests number of additional/reduced servers
  cloudCostOptimization: { type: Number, required: false }, // AI tracks cloud cost reduction
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AIAutoScalingManagement = mongoose.model("AIAutoScalingManagement", AIAutoScalingManagementSchema);
module.exports = AIAutoScalingManagement;
