const mongoose = require("mongoose");

const CommissionPayoutSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.models.CommissionPayout || mongoose.model('CommissionPayout',CommissionPayoutSchema);