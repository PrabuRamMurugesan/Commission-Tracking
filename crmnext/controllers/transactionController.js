import {Transaction} from "../models/Transaction";
import { calculateGstSplit } from "../../frontendnext/utils/taxHelper";

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
export const getFilteredTransactionsFromBBSlive = async (req, res) => {
  try {
    const { role, userId } = req.query;

    // Example base query
    const match = {};

    if (role === "franchise") {
      match.franchiseId = userId;
    } else if (role === "agent") {
      match.agentId = userId;
    } else if (role === "vendor") {
      match.vendorId = userId;
    } else if (role === "customer") {
      match.customerId = userId;
    }

    const transactions = await Transaction.find(match)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ transactions });
  } catch (err) {
    console.error("Transaction fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch transactions" });
  }
};
