const mongoose = require("mongoose");

const AIProductRecommendationsSchema = new mongoose.Schema({
  recommendationId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recommendedProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      reason: { type: String, enum: ["Browsing History", "Previous Purchases", "Popular Items", "Similar Users Bought"] },
      recommendationScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-generated relevance score
    },
  ],
  crossSellProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      reason: { type: String, default: "Frequently Bought Together" },
    },
  ],
  upsellProducts: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      reason: { type: String, default: "Higher Quality / Premium Option" },
    },
  ],
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const AIProductRecommendations = mongoose.model("AIProductRecommendations", AIProductRecommendationsSchema);
module.exports = AIProductRecommendations;
