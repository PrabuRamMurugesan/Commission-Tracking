
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: {
      type: String,
      enum: ["admin", "vendor", "franchisee", "agent", "cbav", "customer"],
    },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    password: String,
    kycStatus: {
      type: String,
      enum: ["pending", "submitted", "verified", "rejected"],
      default: "pending",
    },
    kycDocs: [
      {
        filename: String,
        url: String,
        uploadedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
