// models/TierLevel.js
const mongoose = require("mongoose");

const tierLevelSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ["BBSCART", "Golddex", "EmerJobs"],
    required: true,
  },
  role: {
    type: String,
    enum: ["Agent", "Vendor", "Franchisee", "CBAV", "Recruiter"],
    required: true,
  },
  tierName: { type: String, required: true }, // e.g., Silver, Gold, Platinum
  commissionBonus: {
    type: Number,
    required: true,
  },
  commissionType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  eligibilityCondition: {
    sales: Number,
    revenue: Number,
    referrals: Number,
  },
  active: { type: Boolean, default: true },
});

module.exports =
  mongoose.models.TierLevel || mongoose.model("TierLevel", tierLevelSchema);
