const mongoose = require("mongoose");

const VendorPerformanceSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  totalSales: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  successfulOrders: { type: Number, default: 0 },
  returnedOrders: { type: Number, default: 0 },
  vendorRating: { type: Number, min: 0, max: 5, default: 3 }, // 0 to 5 AI score
  fraudRiskScore: { type: Number, min: 0, max: 100, default: 0 }, // AI-determined risk
  customerFeedback: [
    {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      sentiment: { type: String, enum: ["positive", "neutral", "negative"], default: "neutral" }, // AI-driven sentiment analysis
    },
  ],
  vendorTrustScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-predicted vendor trustworthiness
  stockReorderAlert: { type: Boolean, default: false }, // AI-based stock level monitoring
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const VendorPerformance = mongoose.model("VendorPerformance", VendorPerformanceSchema);
module.exports = VendorPerformance;
