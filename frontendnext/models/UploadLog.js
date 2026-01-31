import mongoose from "mongoose";

const uploadLogSchema = new mongoose.Schema({
  uploadedBy: {
    type: String, // "admin" or "staff"
    default: "admin",
  },

  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    default: "CSV",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  totalRows: {
    type: Number,
    required: true,
  },
  validCount: {
    type: Number,
    required: true,
  },
  flaggedCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["completed", "failed", "partial"],
    default: "completed",
  },
  notes: {
    type: String,
  },
});

export default mongoose.models.UploadLog ||
  mongoose.model("UploadLog", uploadLogSchema);
