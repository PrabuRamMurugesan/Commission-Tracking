const mongoose = require("mongoose");

const VendorTransactionsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  customer: { type: String, required: true },
  salesAmount: { type: Number, required: true },
  commission: { type: Number, required: true },
  payoutStatus: { type: String, default: "Pending" }, // New field for payout request
});

module.exports = mongoose.model("VendorTransactions", VendorTransactionsSchema);
