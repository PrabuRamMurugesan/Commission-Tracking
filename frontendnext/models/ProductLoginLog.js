import mongoose from "mongoose";

const productLoginLogSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VendorInventory",
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  gridCode: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  autoAdjusted: {
    type: Boolean,
    default: false,
  },
  flaggedByAI: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["valid", "hidden", "flagged"],
    default: "valid",
  },
  marginPercent: {
    type: Number,
  },
  vendorPrice: {
    type: Number,
  },
  finalPrice: {
    type: Number,
  },
});

export default mongoose.models.ProductLoginLog ||
  mongoose.model("ProductLoginLog", productLoginLogSchema);
