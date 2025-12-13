const mongoose = require("mongoose");

const AIInvoiceAutomationSchema = new mongoose.Schema({
  invoiceId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      unitPrice: { type: Number, required: true },
      total: { type: Number, required: true },
    },
  ],
  subTotal: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: "USD" },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Pending", "Overdue"],
    default: "Pending",
  },
  aiPredictedPaymentDelay: { type: Number, default: 0 }, // AI estimates days of payment delay
  invoiceDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  autoReminderSent: { type: Boolean, default: false }, // AI auto-sends payment reminders
  notes: { type: String, default: "" },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

const AIInvoiceAutomation = mongoose.model("AIInvoiceAutomation", AIInvoiceAutomationSchema);
module.exports = AIInvoiceAutomation;
