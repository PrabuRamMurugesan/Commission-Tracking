import mongoose from "mongoose";

const rollbackSchema = new mongoose.Schema({
  uploadedBy: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  versionSnapshot: { type: Object, required: true },
  fileName: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.RollbackVersion ||
  mongoose.model("RollbackVersion", rollbackSchema);
