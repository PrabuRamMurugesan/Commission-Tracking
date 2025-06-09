import Transaction from "../models/Transaction";
import { calculateGstSplit } from "../utils/taxHelper";

export const getTransactionReport = async (req, res) => {
  try {
    const txns = await Transaction.find({});

    const enriched = txns.map((txn) => {
      const { gstAmount, cgst, sgst, igst } = calculateGstSplit(
        txn.amount,
        txn.gstRate,
        txn.gstType
      );

      return {
        _id: txn._id,
        orderId: txn.orderId,
        platform: txn.platform,
        sellerName: txn.sellerName,
        amount: txn.amount,
        gstRate: txn.gstRate,
        gstType: txn.gstType,
        gstAmount,
        cgst,
        sgst,
        igst,
        date: txn.date,
        invoiceUrl: txn.invoiceUrl,
      };
    });

    res.status(200).json({ success: true, data: enriched });
  } catch (err) {
    console.error("Transaction report error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
