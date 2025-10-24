import mongoose from "mongoose";

const flaggedProductSchema = new mongoose.Schema({
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
  reason: {
    type: String,
    enum: [
      "margin_violation",
      "price_spike",
      "price_drop",
      "stock_spam",
      "fake_listing",
      "mrp_violation",
      "manual_flag",
    ],
    required: true,
  },
  flaggedAt: {
    type: Date,
    default: Date.now,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  notes: {
    type: String,
  },
});

export default mongoose.models.FlaggedProduct ||
  mongoose.model("FlaggedProduct", flaggedProductSchema);
