import mongoose from "mongoose";

const escrowSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },

    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"],
    },

    percentage: {
      type: Number,
      required: true,
      min: [0, "Percentage must be >= 0"],
      max: [100, "Percentage must be <= 100"],
    },

    walletLedgerRef: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    expectedReleaseDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "On-Hold", "Released", "Cancelled"],
      default: "Pending",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["Pending", "On-Hold", "Released", "Cancelled"],
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        remarks: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Escrow || mongoose.model("Escrow", escrowSchema);
