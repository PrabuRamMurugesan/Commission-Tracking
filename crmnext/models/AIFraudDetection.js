const mongoose = require("mongoose");

const AIFraudDetectionSchema = new mongoose.Schema({
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
  fraudId: { type: String, required: true, unique: true },
  fraudType: { type: String, required: true }, // Examples: "Card Fraud", "Account Takeover", "Fake Investment"
  detectedAnomaly: { type: Boolean, default: false }, // AI flags a transaction as suspicious
  mitigationAction: { type: String, required: false }, // Freeze Account, Reject Transaction, Notify Admin
  transactionAmount: { type: Number, required: true }, // Amount involved in suspected fraud
  amount: { type: Number, required: true },
  transactionType: { type: String, enum: ["Deposit", "Withdrawal", "Purchase", "Refund"], required: true },
  riskScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-determined risk score
  flagged: { type: Boolean, default: false }, // True if the transaction is flagged as suspicious
  fraudReason: { type: String, default: "" }, // Reason why the transaction was flagged
  geoLocation: { type: String, default: "" }, // IP-based location tracking
  locationMismatch: { type: Boolean, default: false }, // If user's IP location does not match usual activity
  deviceMismatch: { type: Boolean, default: false }, // If the device used is different from usual devices
  deviceType: { type: String, default: "" }, // Mobile/Desktop/etc.
  failedAttempts: { type: Number, default: 0 }, // Consecutive failed transactions
  transactionSpeed: { type: Number, default: 0 }, // Time taken to complete the transaction (used for fraud detection)
  aiRecommendations: { type: String, default: "No action required" }, // AI-generated response (e.g., "Verify User", "Block Transaction")
  lastUpdated: { type: Date, default: Date.now },
  timestamps: { type: Date, default: Date.now },
}, { timestamps: true });

const AIFraudDetection = mongoose.model("AIFraudDetection", AIFraudDetectionSchema);
module.exports = AIFraudDetection;
