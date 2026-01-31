const mongoose = require("mongoose");

const CommissionSettingsSchema = new mongoose.Schema({
  role: { type: String, enum: ["Franchise", "Territory Head", "Agent", "Vendor", "Referral"], required: true },
  commissionRate: { type: Number, required: true },
});

module.exports = mongoose.model("CommissionSettings", CommissionSettingsSchema);
