const mongoose = require("mongoose");

const ReferralSelfServiceSchema = new mongoose.Schema({
  referralId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Referrer’s Name
  contactInfo: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  referredUsers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userType: { type: String, enum: ["Customer", "Vendor", "Agent"] },
      joinedDate: { type: Date },
      status: { type: String, enum: ["Active", "Inactive", "Pending"] },
    },
  ],
  totalReferrals: { type: Number, default: 0 }, // Total users referred
  commissionEarned: { type: Number, default: 0 }, // AI-calculated commission
  payoutsReceived: { type: Number, default: 0 }, // Total payouts received
  referralTrend: {
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    yearly: { type: Number, default: 0 },
  },
  aiReferralSuccessRate: { type: Number, default: 0 }, // AI-generated success prediction
  lastPayoutDate: { type: Date, default: null }, // Date of last payout received
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ReferralSelfService = mongoose.model("ReferralSelfService", ReferralSelfServiceSchema);
module.exports = ReferralSelfService;
