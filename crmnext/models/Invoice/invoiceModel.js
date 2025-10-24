import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    hsn: { type: String },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
  },
  { _id: false }
);

const statusTrackerSchema = new mongoose.Schema(
  {
    action: { type: String },
    performedBy: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date },

    platform: { type: String, required: true },
    invoiceType: { type: String, enum: ["Manual", "Auto"] },

    poNumber: { type: String },
    deliveryDate: { type: Date },
    invoiceTags: [String],

    // Buyer Info
    buyerName: { type: String, required: true },
    buyerGSTIN: { type: String },
    buyerState: { type: String },

    // Seller Info
    sellerName: { type: String, required: true },
    sellerGSTIN: { type: String },
    sellerState: { type: String },

    // GST Config
    gstType: { type: String, enum: ["Intra-State", "Inter-State"] },
    globalCGST: { type: Number, default: 0 },
    globalSGST: { type: Number, default: 0 },
    globalIGST: { type: Number, default: 0 },

    // Item List
    items: [itemSchema],

    // Billing & Shipping
    billingAddress: { type: String },
    shippingAddress: { type: String },
    sameAsBilling: { type: Boolean, default: false },

    // Payment Info
    amountPaid: { type: Number, default: 0 },
    walletPaid: { type: Number, default: 0 },
    escrowHeld: { type: Number, default: 0 },
    paymentMode: { type: String },
    paymentReferenceId: { type: String },
    paymentDate: { type: Date },
    useEscrow: { type: Boolean, default: false },
    partialPayment: { type: Boolean, default: false },

    // Additional Charges
    shippingCharges: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 },
    otherCharges: { type: Number, default: 0 },

    // Notes & Terms
    notes: { type: String },
    terms: { type: String },
    attachmentUrl: { type: String },

    // Invoice Summary
    subtotal: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    totalGST: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    walletAdjustment: { type: Number, default: 0 },
    finalPayable: { type: Number, default: 0 },

    // Audit
      // ... existing fields ...
  couponCode:         { type: String, default: '' },
  couponAmount:       { type: Number, default: 0 },
  platformFees:       { type: Number, default: 0 },
  walletUsed:         { type: Number, default: 0 },
  walletBalanceBefore:{ type: Number, default: 0 },
  walletBalanceAfter: { type: Number, default: 0 },
  escrowAmount:       { type: Number, default: 0 },
  escrowStatus:       { type: String, default: '' },
  escrowId:           { type: String, default: '' },
  vendorCommissionPct:{ type: Number, default: 0 },
  vendorCommissionAmt:{ type: Number, default: 0 },
  agentCommissionPct: { type: Number, default: 0 },
  agentCommissionAmt: { type: Number, default: 0 },
  platformCommissionAmt:{ type: Number, default: 0 },
  finalPayoutToVendor:{ type: Number, default: 0 },
    statusTracker: [statusTrackerSchema],
    createdBy: { type: String },
    updatedBy: { type: String },
      // ... existing fields ...
  couponCode:         { type: String, default: '' },
  couponAmount:       { type: Number, default: 0 },
  platformFees:       { type: Number, default: 0 },
  walletUsed:         { type: Number, default: 0 },
  walletBalanceBefore:{ type: Number, default: 0 },
  walletBalanceAfter: { type: Number, default: 0 },
  escrowAmount:       { type: Number, default: 0 },
  escrowStatus:       { type: String, default: '' },
  escrowId:           { type: String, default: '' },
  vendorCommissionPct:{ type: Number, default: 0 },
  vendorCommissionAmt:{ type: Number, default: 0 },
  agentCommissionPct: { type: Number, default: 0 },
  agentCommissionAmt: { type: Number, default: 0 },
  platformCommissionAmt:{ type: Number, default: 0 },
  finalPayoutToVendor:{ type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);
