const mongoose = require("mongoose");

const RevenueTrackingSchema = new mongoose.Schema({
  role: { type: String, enum: ["Franchise", "Territory Head", "Agent", "Vendor", "Referral"], required: true },
  date: { type: Date, default: Date.now },
  periodType: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], required: true },
  revenueAmount: { type: Number, required: true },
});

module.exports = mongoose.model("RevenueTracking", RevenueTrackingSchema);
