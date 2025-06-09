const mongoose = require("mongoose");

const AICustomerInsightsSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  interactions: [
    {
      type: { type: String, enum: ["purchase", "view", "cart", "wishlist", "review"] },
      page: String,
      deviceType: { type: String, enum: ["mobile", "web", "offline"], default: "web" }, // New: Tracks source device
      timestamp: { type: Date, default: Date.now },
    },
  ],
  aiPredictedInterest: {
    type: [String], // Allows multiple interests instead of one
    default: [],
  },
  purchaseFrequency: { type: Number, default: 0 },
  abandonedCarts: { type: Number, default: 0 },
  preferredPaymentMethod: { type: String, default: "Unknown" },
  engagementScore: { type: Number, default: 0 }, 
  sentimentAnalysis: {
    type: String, 
    enum: ["positive", "neutral", "negative"], 
    default: "neutral",
  }, // New: AI sentiment analysis
  loyaltyTier: { 
    type: String, 
    enum: ["bronze", "silver", "gold", "platinum"], 
    default: "bronze",
  }, // New: Loyalty program tracking
  churnRiskScore: { type: Number, default: 0 }, // New: AI-determined churn probability
  discountEligibility: { type: Boolean, default: false }, // New: AI assigns special discounts
  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

const AICustomerInsights = mongoose.model("AICustomerInsights", AICustomerInsightsSchema);
module.exports = AICustomerInsights;
