const mongoose = require("mongoose");

const AISalesForecastingSchema = new mongoose.Schema({
  forecastId: { type: String, required: true, unique: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  category: { type: String, required: true },
  totalSales: { type: Number, required: true },
  salesTrend: { type: String, enum: ["Rising", "Stable", "Declining"], default: "Stable" }, // AI detects trends
  predictedRevenue: { type: Number, required: true }, // AI-generated projected revenue
  marketDemandScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-estimated demand rating
  seasonalImpact: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" }, // AI analyzes seasonality
  businessHealthScore: { type: Number, min: 0, max: 100, default: 70 }, // AI-driven business strength metric
  forecastPeriod: { type: String, enum: ["Monthly", "Quarterly", "Yearly"], required: true },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const AISalesForecasting = mongoose.model("AISalesForecasting", AISalesForecastingSchema);
module.exports = AISalesForecasting;
