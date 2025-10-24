// /pages/api/invoices/[id]/statusTracker.js
import connectDB from "../../../../lib/mongodb";
import Invoice from "../../../../models/Invoice";
import authMiddleware from "../../../../middleware/authMiddleware";
import roleMiddleware from "../../../../middleware/roleMiddleware";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectDB();
  await authMiddleware(req, res);
  await roleMiddleware(["admin", "finance"])(req, res);

  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid invoice ID" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // GST Breakdown
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    const totalCGST = invoice.items.reduce((sum, item) => sum + item.cgst, 0);
    const totalSGST = invoice.items.reduce((sum, item) => sum + item.sgst, 0);
    const totalIGST = invoice.items.reduce((sum, item) => sum + item.igst, 0);
    const gstTotal = totalCGST + totalSGST + totalIGST;
    const grandTotal = subtotal + gstTotal;

    const response = {
      invoiceNumber: invoice.invoiceNumber,
      platform: invoice.platform,
      customerName: invoice.buyerName,
      invoiceDate: invoice.invoiceDate,
      total: invoice.grandTotal || grandTotal,
      escrowStatus: invoice.useEscrow ? "Released" : "Not Applicable",
      paymentStatus: invoice.partialPayment ? "Partially Paid" : "Settled",
      overallProgress: invoice.statusTracker?.length * 10 || 0,

      statusTimeline: invoice.statusTracker || [],
      gstBreakdown: {
        items: invoice.items || [],
        subtotal,
        cgst: totalCGST,
        sgst: totalSGST,
        igst: totalIGST,
        gstTotal,
        grandTotal,
      },
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("❌ StatusTracker API Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
