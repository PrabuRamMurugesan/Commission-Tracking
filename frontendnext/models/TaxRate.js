import mongoose from "mongoose";

const TaxRateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categorySlug: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  gstRate: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["Fixed", "Dynamic"],
    default: "Fixed",
  },
  applicableTo: {
    type: [String], // ['Product', 'Service', 'Commission', 'Delivery']
    default: [],
  },
  cgst: {
    type: Number,
    default: 0,
  },
  sgst: {
    type: Number,
    default: 0,
  },
  igst: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.TaxRate ||
  mongoose.model("TaxRate", TaxRateSchema);
