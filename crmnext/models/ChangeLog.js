import mongoose from "mongoose";

const changeLogSchema = new mongoose.Schema({
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
  fieldChanged: {
    type: String,
    required: true,
  },
  previousValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  changedAt: {
    type: Date,
    default: Date.now,
  },
  triggeredBy: {
    type: String,
    enum: ["admin", "vendor", "system"],
    default: "system",
  },
  notes: {
    type: String,
  },
});

export default mongoose.models.ChangeLog ||
  mongoose.model("ChangeLog", changeLogSchema);
