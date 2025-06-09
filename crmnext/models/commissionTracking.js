const mongoose = require("mongoose");

const CommissionTrackingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Earned by user
  userType: { type: String, enum: ["Franchise", "TerritoryHead", "Agent", "Vendor", "Referral"], required: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true }, // Related transaction
  commissionAmount: { type: Number, required: true }, // AI-calculated commission
  commissionRate: { type: Number, required: true }, // Percentage of sales allocated as commission
  status: { type: String, enum: ["Pending", "Approved", "Paid", "Disputed"], default: "Pending" },
  payoutDate: { type: Date, default: null }, // Scheduled payout date
  disputeStatus: { type: String, enum: ["None", "Under Review", "Resolved"], default: "None" },
  aiPrediction: { type: Number, default: 0 }, // AI-predicted future commissions based on trends
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CommissionTracking = mongoose.model("CommissionTracking", CommissionTrackingSchema);
module.exports = CommissionTracking;
