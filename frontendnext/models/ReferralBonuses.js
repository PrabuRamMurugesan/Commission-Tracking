const mongoose = require("mongoose");

const ReferralBonusesSchema = new mongoose.Schema({
  referrer: { type: String, required: true },
  referredUser: { type: String, required: true },
  date: { type: Date, default: Date.now },
  bonusAmount: { type: Number, required: true },
  payoutStatus: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
});

module.exports = mongoose.model("ReferralBonuses", ReferralBonusesSchema);
