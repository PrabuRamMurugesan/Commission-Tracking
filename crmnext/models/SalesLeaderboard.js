const mongoose = require("mongoose");

const SalesLeaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Franchise", "Territory Head", "Agent", "Vendor", "Referral"], required: true },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  period: { type: String, required: true },
  periodType: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], required: true },
  projectedSales: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SalesLeaderboard", SalesLeaderboardSchema);
