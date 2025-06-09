const mongoose = require("mongoose");

const RevenueBreakdownSchema = new mongoose.Schema({
  role: { type: String, enum: ["Franchise", "Territory Head", "Agent", "Vendor", "Referral"], required: true },
  period: { type: String, required: true },
  periodType: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], required: true },
  commissions: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  incentives: { type: Number, default: 0 },
  otherEarnings: { type: Number, default: 0 },
});

module.exports = mongoose.model("RevenueBreakdown", RevenueBreakdownSchema);
