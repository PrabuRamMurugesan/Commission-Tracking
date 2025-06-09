const mongoose = require("mongoose");

const SalesForecastSchema = new mongoose.Schema({
  period: { type: String, required: true },
  periodType: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], required: true },
  projectedSales: { type: Number, default: 0 },
});

module.exports = mongoose.model("SalesForecast", SalesForecastSchema);
