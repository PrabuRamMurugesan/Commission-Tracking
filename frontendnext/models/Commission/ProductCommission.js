import mongoose from "mongoose";

const CommissionProductSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    role: { type: String, required: true },
    productName: { type: String, required: true },
    commissionType: {
      type: String,
      enum: ["Flat", "Percentage"], // ⬅️ Fix this to match frontend logic      required: true,
    },
    commissionValue: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CommissionProduct ||
  mongoose.model("CommissionProduct", CommissionProductSchema);
