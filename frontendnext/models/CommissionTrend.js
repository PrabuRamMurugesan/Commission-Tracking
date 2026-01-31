const mongoose = require("mongoose");

const CommissionTrendSchema = new mongoose.Schema({
  period: { type: String, required: true },
  periodType: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], required: true },
  amount: { type: Number, default: 0 },
});

module.exports = mongoose.model("CommissionTrend", CommissionTrendSchema);
