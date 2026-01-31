const mongoose = require("mongoose");

const CustomerBecomeVendorTransactionsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  customer: { type: String, required: true },
  salesAmount: { type: Number, required: true },
  commission: { type: Number, required: true },
  payoutStatus: { type: String, default: "Pending" },
});

module.exports = mongoose.model("CustomerBecomeVendorTransactions", CustomerBecomeVendorTransactionsSchema);
