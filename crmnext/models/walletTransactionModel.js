import mongoose from "mongoose";

const walletTransactionSchema = new mongoose.Schema(
  {
    txnId: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    escrowId: { type: String },
    platform: { type: String, required: true },
    type: { type: String, enum: ["Credit", "Debit"], required: true },
    reason: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Completed", "Pending"], required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.WalletTransaction ||
  mongoose.model("WalletTransaction", walletTransactionSchema);
