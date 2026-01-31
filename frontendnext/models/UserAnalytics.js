const mongoose = require("mongoose");

const UserAnalyticsSchema = new mongoose.Schema({
  userType: { type: String, enum: ["Franchise", "Territory Head", "Agent", "Vendor", "Referral"], required: true },
  period: { type: String, required: true },
  periodType: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], required: true },
  engagements: { type: Number, default: 0 },
});

module.exports = mongoose.model("UserAnalytics", UserAnalyticsSchema);
