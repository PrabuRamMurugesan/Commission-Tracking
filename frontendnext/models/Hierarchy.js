const mongoose = require("mongoose");

const HierarchySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["Franchise", "Territory Head", "Agent", "Vendor", "Referral"], required: true },
  totalSales: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
});

module.exports = mongoose.model("Hierarchy", HierarchySchema);
