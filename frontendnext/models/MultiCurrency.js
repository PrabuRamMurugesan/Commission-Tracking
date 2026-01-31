const mongoose = require("mongoose");

const MultiCurrencySchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  rate: { type: Number, required: true },
});

module.exports = mongoose.model("MultiCurrency", MultiCurrencySchema);
