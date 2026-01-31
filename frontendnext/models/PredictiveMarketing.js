const mongoose = require("mongoose");

const PredictiveMarketingSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MarketingCampaign",
    required: true,
    index: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  adClicks: { type: Number, default: 0 }, // Number of times the customer clicked on an ad
  conversions: { type: Number, default: 0 }, // Number of successful purchases
  abandonedCarts: { type: Number, default: 0 }, // Cart abandonments after ad click
  aiLeadScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-based likelihood to convert
  retargetingRequired: { type: Boolean, default: false }, // AI suggests retargeting if lead is promising
  preferredAdPlatform: { type: String, enum: ["Facebook", "Google", "Instagram", "LinkedIn"], default: "Facebook" }, // AI detects the best ad platform
  campaignROI: { type: Number, default: 0 }, // AI-predicted ROI for marketing campaigns
  personalizedOffer: { type: String, default: "" }, // AI suggests a specific discount or offer
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const PredictiveMarketing = mongoose.model("PredictiveMarketing", PredictiveMarketingSchema);
module.exports = PredictiveMarketing;
