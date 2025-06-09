const mongoose = require("mongoose");

const TerritoryHeadTransactionsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  agent: { type: String, required: true },
  customer: { type: String, required: true },
  salesAmount: { type: Number, required: true },
  commission: { type: Number, required: true },
});

module.exports = mongoose.model("TerritoryHeadTransactions", TerritoryHeadTransactionsSchema);
