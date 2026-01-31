
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: {
      type: String,
      enum: [
        "admin",
        "vendor",
        "franchisee",
        "territory",
        "agent",
        "cbav",
        "customer",
      ],
    },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    password: String,
    kycStatus: {
      type: String,
      enum: ["pending", "submitted", "verified", "rejected"],
      default: "pending",
    },
    franchiseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FranchiseHead",
      default: null,
    },
    territoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TerritoryHead",
      default: null,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      default: null,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },
    kycDocs: [
      {
        filename: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    profileImage: { type: String, default: "" },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        country: String,
        pincode: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    phone: String,
    accountStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
