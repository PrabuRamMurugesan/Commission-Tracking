const mongoose = require("mongoose");

const AIExpenseTrackingSchema = new mongoose.Schema({
  expenseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  category: {
    type: String,
    enum: ["Marketing", "Salaries", "Operations", "Logistics", "IT Infrastructure", "Miscellaneous"],
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "USD" }, // Supports multi-currency tracking
  convertedAmountUSD: { type: Number, default: 0 }, // Stores equivalent in USD
  expenseDate: { type: Date, default: Date.now },
  aiPredictedNextMonthExpense: { type: Number, default: 0 }, // AI-predicted forecast for future expenses
  aiCostReductionSuggestion: { type: String, default: "" }, // AI recommends cost-cutting strategies
  budgetAllocation: { type: Number, default: 0 }, // AI-suggested budget allocation per category
  expenseDeviationAlert: { type: Boolean, default: false }, // AI detects if expense exceeds set limit
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }, // Links expenses to a vendor (if applicable)
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const AIExpenseTracking = mongoose.model("AIExpenseTracking", AIExpenseTrackingSchema);
module.exports = AIExpenseTracking;
