import mongoose from "mongoose";

const invoiceTaxRowSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    taxType: { type: String, enum: ["C", "S"], default: "C" }, // C=CGST, S=SGST (or your codes)
    category: { type: String, default: "Goods" },
    hsnSac: { type: String },
    gstPercent: { type: Number, default: 0 },
    taxableValue: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    jurisdiction: { type: String },
    sellerGSTIN: { type: String },
    buyerGSTIN: { type: String },
    reverseCharge: { type: Boolean, default: false },
    invoiceType: { type: String, default: "Intra-State" },
    platform: { type: String, default: "BBSCART" },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.InvoiceTaxRow ||
  mongoose.model("InvoiceTaxRow", invoiceTaxRowSchema);
