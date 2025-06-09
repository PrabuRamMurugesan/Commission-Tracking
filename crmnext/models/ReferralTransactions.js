const mongoose = require("mongoose");

const ReferralTransactionsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  referredCustomer: { type: String, required: true },
  salesAmount: { type: Number, required: true },
  commission: { type: Number, required: true },
  payoutStatus: { type: String, default: "Pending" },
});

module.exports = mongoose.model("ReferralTransactions", ReferralTransactionsSchema);
