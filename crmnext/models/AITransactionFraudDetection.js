const mongoose = require("mongoose");

const AITransactionFraudDetectionSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  transactionAmount: { type: Number, required: true },
  transactionType: { 
    type: String, 
    enum: ["Deposit", "Withdrawal", "Purchase", "Refund"], 
    required: true 
  },
  riskScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-determined fraud probability
  flagged: { type: Boolean, default: false }, // True if flagged as fraudulent
  fraudReason: { type: String, default: "" }, // Explanation of why it was flagged
  geoLocation: { type: String, default: "" }, // IP-based location tracking
  deviceType: { type: String, default: "" }, // Mobile, Desktop, etc.
  unusualPattern: { type: Boolean, default: false }, // Detects abnormal spending behavior
  failedAttempts: { type: Number, default: 0 }, // Tracks multiple failed payments
  transactionSpeed: { type: Number, default: 0 }, // Time taken to complete transaction (for fraud detection)
  aiRecommendations: { type: String, default: "No action required" }, // AI-generated response (e.g., "Verify User", "Block Transaction")
  accountLock: { type: Boolean, default: false }, // AI-initiated account lock for repeated fraud attempts
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const AITransactionFraudDetection = mongoose.model("AITransactionFraudDetection", AITransactionFraudDetectionSchema);
module.exports = AITransactionFraudDetection;
