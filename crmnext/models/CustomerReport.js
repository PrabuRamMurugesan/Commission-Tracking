// models/Customer.js

const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  customerId: String,
  name: String,
  email: String,
  phone: String,
  platform: String, // e.g., BBSCART or Golddex
  role: String, // Customer, Vendor, Agent, CBV, Franchisee
  referredBy: String, // Referral agent/vendor/CBV
  zone: String,
  status: String, // Active, Inactive, Blocked
  walletBalance: Number,
  totalOrders: Number,
  kycStatus: String, // Pending, Verified, Rejected
  lastActive: Date,
  comments: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Customer || mongoose.model("CustomerReport", customerSchema);
