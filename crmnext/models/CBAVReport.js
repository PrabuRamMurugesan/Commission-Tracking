// models/CBAVReport.js
const mongoose = require("mongoose");

const cbavSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  designation: String,
  platform: String,
  profilePic: String,
  whatsappNumber: String,
  zone: String,
  stateCode: String,
  cityCode: String,
  franchiseeId: String,
  commissionRates: Array,
  totalCustomers: Number,
  totalTransactions: Number,
  commissionEarned: Number,
  commissionPending: Number,
  actions: Object,
  accountStatus: String,
  joinedDate: Date,
  loginHistory: Array,
  createdAt: Date,
  updatedAt: Date,
});

module.exports =
  mongoose.models.CBAV || mongoose.model("CBAV", cbavSchema, "cbvs");
// 👈 Important: 3rd param sets the **collection name explicitly** to `cbvs`
