const mongoose = require("mongoose");

const AIDisputeResolutionSchema = new mongoose.Schema({
  disputeId: { type: String, required: true, unique: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issueType: { 
    type: String, 
    enum: ["Refund Request", "Chargeback", "Transaction Error", "Unauthorized Payment"],
    required: true
  },
  disputeReason: { type: String, required: true },
  disputeStatus: {
    type: String,
    enum: ["Pending", "Under Review", "Resolved", "Rejected"],
    default: "Pending",
  },
  aiFraudDetectionScore: { type: Number, min: 0, max: 100, default: 50 }, // AI-based fraud probability
  aiRecommendedAction: { 
    type: String, 
    enum: ["Approve Refund", "Reject Refund", "Escalate to Human Review"], 
    default: "Escalate to Human Review" 
  },
  caseReportGenerated: { type: Boolean, default: false }, // AI auto-generates dispute case reports
  customerSentimentScore: { type: Number, min: 0, max: 100, default: 50 }, // AI sentiment analysis for complaints
  resolutionDate: { type: Date, default: null }, // Populated when resolved
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const AIDisputeResolution = mongoose.model("AIDisputeResolution", AIDisputeResolutionSchema);
module.exports = AIDisputeResolution;
