const mongoose = require("mongoose");

const AIRevenuePredictionsSchema = new mongoose.Schema({
  revenueId: { type: String, required: true, unique: true },
  totalSales: { type: Number, required: true },
  projectedRevenue: { type: Number, required: true }, // AI-generated projected revenue
  profitMargin: { type: Number, required: true }, // AI-predicted profit margin
  estimatedGrowthRate: { type: Number, required: true, min: 0, max: 100 }, // Growth rate in %
  marketImpactScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-estimated external market impact
  expenseToRevenueRatio: { type: Number, required: true }, // AI calculates cost vs. revenue
  revenueDeviationAlert: { type: Boolean, default: false }, // AI detects unexpected revenue drops
  simulationVariables: { type: Array, default: [] }, // Users can input different parameters for revenue predictions
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const AIRevenuePredictions = mongoose.model("AIRevenuePredictions", AIRevenuePredictionsSchema);
module.exports = AIRevenuePredictions;
