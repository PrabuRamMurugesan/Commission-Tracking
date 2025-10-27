// File: pages/api/invoices/[id].ts
import dbConnect from "../../../lib/mongodb";
import Invoice from "../../../models/Invoice/invoiceModel";
import cors from "../../../lib/withCors.js";

export default async function handler(req, res) {
  await cors(req, res); // 👈 Must be called first

  await dbConnect();
  const { id } = req.query;

  // --- FETCH ONE INVOICE ---
  if (req.method === "GET") {
    try {
      const invoice = await Invoice.findById(id);
      if (!invoice) {
        return res
          .status(404)
          .json({ success: false, message: "Invoice not found" });
      }
      return res.status(200).json({ success: true, invoice });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  // --- UPDATE AN INVOICE ---
  if (req.method === "PUT") {
    try {
      const data = req.body;
      const invoice = await Invoice.findById(id);
      if (!invoice) {
        return res
          .status(404)
          .json({ success: false, message: "Invoice not found" });
      }

      // Overwrite all updatable fields
      Object.assign(invoice, {
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        platform: data.platform,
        invoiceType: data.invoiceType,
        poNumber: data.poNumber,
        deliveryDate: data.deliveryDate,
        invoiceTags: data.invoiceTags,

        buyerName: data.buyerName,
        buyerGSTIN: data.buyerGSTIN,
        buyerState: data.buyerState,
        sellerName: data.sellerName,
        sellerGSTIN: data.sellerGSTIN,
        sellerState: data.sellerState,

        gstType: data.gstType,
        globalCGST: data.globalCGST,
        globalSGST: data.globalSGST,
        globalIGST: data.globalIGST,

        items: data.items,

        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        sameAsBilling: data.sameAsBilling,

        amountPaid: data.amountPaid,
        walletPaid: data.walletPaid,
        escrowHeld: data.escrowHeld,
        paymentMode: data.paymentMode,
        paymentReferenceId: data.paymentReferenceId,
        paymentDate: data.paymentDate,
        useEscrow: data.useEscrow,
        partialPayment: data.partialPayment,

        shippingCharges: data.shippingCharges,
        roundOff: data.roundOff,
        otherCharges: data.otherCharges,

        notes: data.notes,
        terms: data.terms,
        attachmentUrl: data.attachmentUrl,

        subtotal: data.subtotal,
        totalDiscount: data.totalDiscount,
        totalGST: data.totalGST,
        grandTotal: data.grandTotal,
        walletAdjustment: data.walletAdjustment,
        finalPayable: data.finalPayable,

        updatedBy: data.updatedBy || "Admin",
      });

      // Append audit log
      invoice.statusTracker.push({
        action: "Edited",
        performedBy: invoice.updatedBy,
        timestamp: new Date(),
      });

      await invoice.save();
      return res.status(200).json({ success: true, invoice });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error on update" });
    }
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "PUT"]);
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
