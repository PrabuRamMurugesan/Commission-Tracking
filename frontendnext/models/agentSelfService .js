const mongoose = require("mongoose");

const AgentSelfServiceSchema = new mongoose.Schema({
  agentId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Agent's Name
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  referredCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer" }], // Customers referred by the agent
  referredVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }], // Vendors referred by the agent
  totalSales: { type: Number, default: 0 }, // Total sales made by agent
  commissionEarned: { type: Number, default: 0 }, // AI-calculated commission for the agent
  payoutsReceived: { type: Number, default: 0 }, // Total payouts received
  salesTrend: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 },
  },
  aiRevenueForecast: { type: Number, default: 0 }, // AI-generated revenue predictions
  lastPayoutDate: { type: Date, default: null }, // Date of the last payout received
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AgentSelfService = mongoose.model("AgentSelfService", AgentSelfServiceSchema);
module.exports = AgentSelfService;
