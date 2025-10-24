import mongoose from "mongoose";

const vendorCustomerRotationSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  gridCode: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
  },
  selectedVendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lockedFromWishlist: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

vendorCustomerRotationSchema.index(
  { customerId: 1, gridCode: 1, date: 1 },
  { unique: true }
);

export default mongoose.models.VendorCustomerRotation ||
  mongoose.model("VendorCustomerRotation", vendorCustomerRotationSchema);
