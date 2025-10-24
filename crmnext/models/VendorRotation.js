import mongoose from "mongoose";

const vendorRotationSchema = new mongoose.Schema({
  gridCode: {
    type: String,
    required: true,
  },
  date: {
    type: String, // formatted as YYYY-MM-DD
    required: true,
  },
  selectedVendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  manuallyOverridden: {
    type: Boolean,
    default: false,
  },
});

vendorRotationSchema.index({ gridCode: 1, date: 1 }, { unique: true });

export default mongoose.models.VendorRotation ||
  mongoose.model("VendorRotation", vendorRotationSchema);
