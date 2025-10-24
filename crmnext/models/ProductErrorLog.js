import mongoose from "mongoose";

const ProductErrorLogSchema = new mongoose.Schema(
  {
    message: { type: String },
    stack: { type: String },
    endpoint: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ip: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ProductErrorLog ||
  mongoose.model("ProductErrorLog", ProductErrorLogSchema);
