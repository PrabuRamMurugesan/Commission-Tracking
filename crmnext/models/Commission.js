// import mongoose from "mongoose";

// const CommissionSchema = new mongoose.Schema({
//   agent: { type: String, required: true },
//   amount: { type: Number, required: true },
//   date: { type: Date, default: Date.now },
// });

// export default mongoose.models.Commission || mongoose.model("Commission", CommissionSchema);
// backend/models/Commission.js
// models/Commission.js
const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema({
  commissionId: { type: String, required: true, unique: true },

  // Relationship Fields
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", default: null },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent", default: null },
  franchiseeId: { type: mongoose.Schema.Types.ObjectId, ref: "Franchisee", default: null },
  cbavId: { type: mongoose.Schema.Types.ObjectId, ref: "CBAV", default: null },

  // Meta Info
  platform: { type: String, enum: ["BBSCART", "Golddex"], required: true },
  role: { type: String, enum: ["Vendor", "Agent", "Franchisee", "CBAV"], required: true },
  sellerName: { type: String, required: true },
  buyerName: { type: String },
  buyerPhone: { type: String },

  // Commission Details
  rate: { type: Number, required: true }, // stored as % number e.g. 5
  amount: { type: Number, required: true },
  payoutStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },

  // Transaction Reference
  transactionId: { type: String, required: true },
  orderId: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Commission || mongoose.model("Commission", commissionSchema);
