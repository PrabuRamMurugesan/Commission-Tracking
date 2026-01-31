// models/CommissionVariableRule.js
const mongoose = require("mongoose");

const commissionVariableRuleSchema = new mongoose.Schema({
  ruleType: {
    type: String,
    enum: ["product", "service", "orderValue", "dateRange", "paymentMethod"],
    required: true,
  },
  platform: {
    type: String,
    enum: ["BBSCART", "Golddex", "Thiaworld", "EmerJobs"],
    required: true,
  },
  role: {
    type: String,
    enum: ["Agent", "Vendor", "Franchisee", "CBAV", "Recruiter", "Referrer"],
    required: true,
  },
  targetId: {
    type: String, // productId, serviceId, etc.
    default: null,
  },
  targetName: {
    type: String,
    default: "All Items",
  },
  commissionType: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  commissionValue: {
    type: Number,
    required: true,
  },
  conditions: {
    minAmount: { type: Number, default: 0 },
    maxAmount: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    paymentMethod: { type: String },
  },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.CommissionVariableRule ||
  mongoose.model("CommissionVariableRule", commissionVariableRuleSchema);
