const mongoose = require("mongoose");

const TerritoryHeadSelfServiceSchema = new mongoose.Schema({
  territoryHeadId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Territory Head Name
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  managedFranchises: [{ type: mongoose.Schema.Types.ObjectId, ref: "FranchiseSelfService" }], // List of franchises under the Territory Head
  managedAgents: [{ type: mongoose.Schema.Types.ObjectId, ref: "AgentSelfService" }], // List of agents under the Territory Head
  totalRevenue: { type: Number, default: 0 }, // Total revenue generated in the territory
  totalSales: { type: Number, default: 0 }, // Total sales in the territory
  commissionEarned: { type: Number, default: 0 }, // Commission calculated by AI
  payoutsReceived: { type: Number, default: 0 }, // Payouts processed for the Territory Head
  activeVendors: { type: Number, default: 0 }, // Number of vendors managed in the territory
  activeCustomers: { type: Number, default: 0 }, // Number of customers in the territory
  salesTrend: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 },
  },
  aiRevenueForecast: { type: Number, default: 0 }, // AI-powered sales & commission predictions
  lastPayoutDate: { type: Date, default: null }, // Last payout date
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TerritoryHeadSelfService = mongoose.model("TerritoryHeadSelfService", TerritoryHeadSelfServiceSchema);
module.exports = TerritoryHeadSelfService;
