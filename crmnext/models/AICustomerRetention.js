const mongoose = require("mongoose");

const AICustomerRetentionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  churnRiskScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-determined risk score for churn
  loyaltyScore: { type: Number, min: 0, max: 100, default: 70 }, // Loyalty rating based on spending & engagement
  totalPurchases: { type: Number, default: 0 }, // Number of completed purchases
  lastPurchaseDate: { type: Date, default: null }, // Last recorded purchase date
  engagementFrequency: { type: Number, default: 0 }, // Tracks login & platform usage frequency
  recommendedRetentionOffer: { type: String, default: "" }, // AI suggests a special offer (e.g., discount, bonus points)
  lifetimeValuePrediction: { type: Number, default: 0 }, // AI-predicted long-term revenue from this customer
  inactiveDays: { type: Number, default: 0 }, // Number of days since last activity
  automatedRetentionTriggered: { type: Boolean, default: false }, // If AI already sent a retention campaign
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const AICustomerRetention = mongoose.model("AICustomerRetention", AICustomerRetentionSchema);
module.exports = AICustomerRetention;
