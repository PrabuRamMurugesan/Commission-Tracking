const mongoose = require("mongoose");

const AIAutoResourceAllocationSchema = new mongoose.Schema({
  allocationId: { type: String, required: true, unique: true },
  serverInstance: { type: String, required: true }, // Server instance affected
  resourceType: { type: String, required: true }, // CPU, Memory, Disk, Network
  currentUsage: { type: Number, required: true }, // Current resource utilization %
  predictedIncrease: { type: Boolean, default: false }, // AI forecasts if more resources are needed
  predictedDecrease: { type: Boolean, default: false }, // AI suggests deallocating unused resources
  recommendedAdjustment: { type: Number, required: false }, // AI-suggested increase or decrease in resources
  costImpact: { type: Number, required: false }, // AI tracks cost savings from optimization
  lastChecked: { type: Date, default: Date.now },
}, { timestamps: true });

const AIAutoResourceAllocation = mongoose.model("AIAutoResourceAllocation", AIAutoResourceAllocationSchema);
module.exports = AIAutoResourceAllocation;
