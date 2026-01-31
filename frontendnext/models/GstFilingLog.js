import mongoose from "mongoose";

const gstFilingLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["Vendor", "Agent", "CBAV", "Franchisee", "TerritoryHead"],
    required: true,
  },
  returnType: {
    type: String,
    enum: ["GSTR-1", "GSTR-3B"],
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  gstin: {
    type: String,
    required: true,
    match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  },
  fileName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Generated", "Filed"],
    default: "Generated",
  },
  arn: {
    type: String,
    default: "",
  },
  filedOn: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.GstFilingLog ||
  mongoose.model("GstFilingLog", gstFilingLogSchema);
