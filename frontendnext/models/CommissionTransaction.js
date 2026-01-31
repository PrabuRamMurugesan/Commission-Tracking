// // models/CommissionTransaction.js

// import mongoose from "mongoose";

// const CommissionTransactionSchema = new mongoose.Schema(
//   {
//     date: { type: Date, required: true },
//     platform: { type: String, default: "-" },
//     sellerName: { type: String, default: "-" },
//     sellerRole: { type: String, default: "-" },
//     commissionAmount: { type: Number, default: 0 },
//     commissionPercent: { type: Number, default: 0 },
//     transactionId: { type: String, default: "-" },
//     orderId: { type: String, default: "-" },
//     payoutStatus: { type: String, default: "-" },
//     paymentMethod: { type: String },
//     finalAmount: { type: Number },
//     orderStatus: { type: String },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.models.CommissionTransaction ||
//   mongoose.model("CommissionTransaction", CommissionTransactionSchema);
