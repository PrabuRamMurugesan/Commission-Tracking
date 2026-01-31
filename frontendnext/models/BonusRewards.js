const mongoose = require("mongoose");

const BonusRewardsSchema = new mongoose.Schema({
  role: { type: String, enum: ["Franchise", "Territory Head", "Agent", "Vendor", "Referral"], required: true },
  period: { type: String, required: true },
  periodType: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], required: true },
  performanceBonus: { type: Number, default: 0 },
  referralBonus: { type: Number, default: 0 },
  salesIncentive: { type: Number, default: 0 },
});

module.exports = mongoose.model("BonusRewards", BonusRewardsSchema);
