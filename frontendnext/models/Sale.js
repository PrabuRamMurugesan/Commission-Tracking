const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: {
    type: String,
    enum: ["Jewelry", "Electronics", "Garments", "Others"],
    default: "Others",
  },
  saleAmount: { type: Number, required: true },
  currency: { type: String, default: "INR" }, // Multi-currency support

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Customer making the purchase
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Agent associated with the sale

  // Referral & Vendor-specific tracking
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who referred the customer
  customerVendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Customer who became a vendor

  franchiseeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  territoryHeadId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  saleDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Completed", "Pending", "Refunded"],
    default: "Completed",
  },
});

module.exports = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
