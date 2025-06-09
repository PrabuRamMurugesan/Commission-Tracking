const mongoose = require("mongoose");
// ✅ Payout schema – for commissions, vendors, agents, franchisees, etc.
const payoutSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  commissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commission",
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },

  paymentMethod: {
    type: String,
    enum: ["Bank Transfer", "Wallet", "UPI", "Other"],
    required: true,
  },
  paymentReference: { type: String },
  bankDetails: {
    accountNumber: { type: String },
    bankName: { type: String },
    IFSC: { type: String },
  },

  status: {
    type: String,
    enum: ["Pending", "Processing", "Failed", "Completed"],
    default: "Pending",
  },
  transactionDate: { type: Date, default: Date.now },
  payoutDate: { type: Date },
  failureReason: { type: String },
});

// ✅ Sales + Order transactions schema — core for Sales Report Module
const transactionSchema = new mongoose.Schema(
  {
    // Core Order/Transaction Info
    orderId: { type: String, required: false },
    transactionId: { type: String },
    platform: {
      type: String,
      enum: ["BBSCART", "Golddex", "Thiaworld"],
      required: false,
    },

    // Parties involved
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    franchiseeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    buyerName: { type: String },
    buyerPhone: { type: String },
    sellerName: { type: String },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sellerRole: {
      type: String,
      enum: ["Vendor", "Agent", "CBAV", "Franchisee"],
    },

    // Product Info
    productTitles: [{ type: String }],
    totalQuantity: { type: Number },
    // ✅ GST fields
    isGSTApplicable: { type: Boolean, default: false },
    gstType: { type: String, enum: ["CGST_SGST", "IGST", null], default: null },
    cgstPercentage: { type: Number, default: 0 },
    sgstPercentage: { type: Number, default: 0 },
    igstPercentage: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
    totalGSTAmount: { type: Number, default: 0 },
    gstBreakdown: {
      cgst: { type: Number },
      sgst: { type: Number },
      igst: { type: Number },
    },
    // Financials
    amount: Number,
    finalAmount: Number,
    commissionApplied: Number,

    paymentStatus: {
      type: String,
      enum: ["paid", "escrow", "failed"],
      required: false,
    },
    orderStatus: {
      type: String,
      enum: ["delivered", "returned", "cancelled"],
      required: false,
    },
    paymentMethod: {
      type: String,
      enum: ["Wallet", "UPI", "Netbanking", "COD", "Razorpay"],
    },
    payoutStatus: {
      type: String,
      enum: ["paid", "pending", "on-hold"],
      required: false,
    },
    transactionType: {
      type: String,
      enum: ["Credit", "Debit"],
      required: false,
    },

    transactionCategory: {
      type: String,
      enum: [
        "Order Payment",
        "Commission Payout",
        "Refund",
        "Wallet Recharge",
        "Bonus",
        "Escrow Release",
        "Other",
      ],
      required: false,
    },

    balanceAfter: {
      type: Number,
      required: false,
    },

    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "success",
    },

    comments: {
      type: String,
      required: false,
    },
    date: Date,
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

module.exports = {
  Transaction,
};
