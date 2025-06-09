import mongoose from "mongoose";

const tierSchema = new mongoose.Schema(
  {
    role: { type: String, required: true }, // e.g., Vendor, Agent, CBAV
    platform: { type: String, required: true }, // e.g., BBSCART, Golddex, Emerjobs
    tierName: { type: String, required: true }, // e.g., Gold, Diamond
    targetType: { type: String, required: true }, // Sales, Revenue, Referrals
    targetValue: { type: Number, required: true },
    bonusType: { type: String, required: true }, // Percentage or Flat
    bonusValue: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CommissionTier ||
  mongoose.model("CommissionTier", tierSchema);
