// models/FranchiseeReport.js
const mongoose = require("mongoose");

const franchiseeSchema = new mongoose.Schema(
  {
    franchiseeId: String,
    name: String,
    email: String,
    phone: String,
    whatsappNumber: String,
    platform: String,
    role: String,
    referredBy: String,
    zone: String,
    status: String,
    walletBalance: Number,
    totalOrders: Number,
    kycStatus: String,
    lastActive: Date,
    comments: String,
  },
  {
    timestamps: true,
    collection: "francises", // Important: collection name in DB
  }
);

module.exports =
  mongoose.models.FranchiseeReport ||
  mongoose.model("FranchiseeReport", franchiseeSchema);
