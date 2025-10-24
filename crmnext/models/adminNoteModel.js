// models/adminNoteModel.js
import mongoose from "mongoose";

const adminNoteSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    department: { type: String },
    assignedTo: { type: String }, // or user ref
    reminder: Date,
    escalationId: String,
    gstWalletRelated: { type: Boolean, default: false },
    attachmentUrl: String,
    createdBy: String,
  },
  { timestamps: true }
);

export default mongoose.models.AdminNote ||
  mongoose.model("AdminNote", adminNoteSchema);
