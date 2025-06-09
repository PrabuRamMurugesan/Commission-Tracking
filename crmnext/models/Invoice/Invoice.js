// /models/Invoice.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    hsn: { type: String },
    gstType: {
      type: String,
      enum: ["GST", "Non-GST", "Exempted"],
      default: "GST",
    },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },

    platform: {
      type: String,
      enum: ["BBSCART", "GOLDEX", "DELIVERY", "EMERJOBS"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Partial", "Draft"],
      default: "Pending",
    },

    buyer: {
      name: { type: String, required: true },
      // gstin: { type: String },
      // state: { type: String },
    },
    seller: {
      name: { type: String },
      // gstin: { type: String },
      // state: { type: String },
    },

    items: [itemSchema],

    payment: {
      amountPaid: { type: Number, default: 0 },
      mode: {
        type: String,
        enum: ["Cash", "Card", "Wallet", "Escrow", "UPI", "Bank Transfer"],
        default: "Cash",
      },
      isEscrow: { type: Boolean, default: false },
      isPartialPayment: { type: Boolean, default: false },
    },

    totalAmount: { type: Number, required: true },
    totalGST: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    notes: { type: String },

    createdBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String },
    },

    statusTracker: [
      {
        status: String,
        updatedAt: Date,
        updatedBy: {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          role: String,
        },
      },
    ],

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);
