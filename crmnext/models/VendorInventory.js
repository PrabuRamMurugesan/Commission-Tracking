import mongoose from "mongoose";

const vendorInventorySchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MasterProduct",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number, // after margin guard
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "hidden", "flagged"],
      default: "active",
    },
    marginAdjusted: {
      type: Boolean,
      default: false,
    },
    flaggedByAI: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.VendorInventory ||
  mongoose.model("VendorInventory", vendorInventorySchema);
