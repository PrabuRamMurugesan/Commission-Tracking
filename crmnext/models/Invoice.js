// const mongoose = require("mongoose");

// const invoiceSchema = new mongoose.Schema(
//   {
//     invoiceNumber: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     customerName: { type: String, required: true },
//     invoiceNumber: { type: String, required: true },
//     date: { type: Date, required: true },
//     totalAmount: { type: Number, required: true },
//     platform: {
//       type: String,
//       enum: ["BBSCART", "Golddex", "DeliveryApp", "Emerjobs"],
//       required: true,
//     },
//     orderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//     },
//     transactionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Transaction",
//     },
//     customerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     vendorId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     agentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     franchiseeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Franchise",
//     },
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },

//     items: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//         },
//         name: String,
//         quantity: Number,
//         price: Number,
//         discount: Number,
//         total: Number,
//       },
//     ],

//     subTotal: Number,
//     discountTotal: Number,
//     taxableValue: Number,

//     gstType: {
//       type: String,
//       enum: ["CGST_SGST", "IGST"],
//       required: true,
//     },
//     cgstAmount: {
//       type: Number,
//       default: 0,
//     },
//     sgstAmount: {
//       type: Number,
//       default: 0,
//     },
//     igstAmount: {
//       type: Number,
//       default: 0,
//     },

//     totalAmount: {
//       type: Number,
//       required: true,
//     },
//     paidAmount: {
//       type: Number,
//       default: 0,
//     },
//     pendingAmount: {
//       type: Number,
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["Paid", "Unpaid", "Partially Paid"],
//       default: "Unpaid",
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["Wallet", "UPI", "COD", "Bank", "Card"],
//     },
//     walletUsed: {
//       type: Number,
//       default: 0,
//     },
//     couponApplied: String,

//     invoiceStatus: {
//       type: String,
//       enum: ["Generated", "Sent", "Viewed", "Cancelled"],
//       default: "Generated",
//     },
//     invoiceDate: {
//       type: Date,
//       default: Date.now,
//     },
//     dueDate: Date,

//     remarks: String,
//     pdfUrl: String,
//     qrCodeUrl: String,
//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Invoice", invoiceSchema);
