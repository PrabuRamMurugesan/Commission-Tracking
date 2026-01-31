// import mongoose, { Schema } from "mongoose";

// const escrowEventSchema = new Schema(
//   {
//     event: { type: String, required: true },
//     timestamp: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// const escrowSchema = new Schema(
//   {
//     reference: { type: String, required: true },
//     amount: { type: Number, required: true },
//     percentage: { type: Number, required: true },
//     walletLedgerRef: { type: String, required: true },
//     startDate: { type: Date, required: true },
//     expectedReleaseDate: { type: Date, required: true },
//     status: {
//       type: String,
//       enum: ["Locked", "Released", "Refund Initiated", "Refunded"],
//       default: "Locked",
//     },
//     events: [escrowEventSchema],
//     aiSummary: { type: String },
//   },
//   { _id: false }
// );

// const invoiceSchema = new Schema(
//   {
//     invoiceNumber: { type: String, unique: true, required: true },
//     platform: {
//       type: String,
//       enum: ["BBSCART", "Thiaworld", "Golddex", "EmerJobs"],
//       required: true,
//     },
//     escrow: { type: escrowSchema, required: true },

//     // … other invoice fields …
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Invoice ||
//   mongoose.model("Invoice", invoiceSchema);
import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  hsn: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["BBSCART", "Golddex", "EmerJobs", "Thiaworld"],
      required: true,
    },

    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date },

    buyerName: { type: String, required: true },
    buyerGSTIN: { type: String },
    buyerState: { type: String },

    sellerName: { type: String, required: true },
    sellerGSTIN: { type: String, required: true },
    sellerState: { type: String },

    items: [invoiceItemSchema],

    subtotal: { type: Number, required: true },
    totalGST: { type: Number, required: true },
    grandTotal: { type: Number, required: true },

    amountPaid: { type: Number, default: 0 },
    walletPaid: { type: Number, default: 0 },
    escrowHeld: { type: Number, default: 0 },

    paymentMode: {
      type: String,
      enum: ["Cash", "Bank", "Wallet"],
      required: true,
    },

    useEscrow: { type: Boolean, default: false },
    partialPayment: { type: Boolean, default: false },

    notes: { type: String },

    // 🧩 NEW: Optional one-to-one relation to Escrow
    escrow: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Escrow",
    },

    statusTracker: [
      {
        action: String,
        role: String,
        timestamp: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);
