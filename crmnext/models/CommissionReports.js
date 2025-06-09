const mongoose = require("mongoose");

const CommissionReportsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Franchise", "Territory Head", "Agent", "Vendor", "Referral"], required: true },
  date: { type: Date, default: Date.now },
  commission: { type: Number, default: 0 },
});

module.exports = mongoose.model("CommissionReports", CommissionReportsSchema);
