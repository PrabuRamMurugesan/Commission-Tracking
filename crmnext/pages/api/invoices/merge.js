// pages/api/invoices/merge.js
import dbConnect from "../../../lib/mongodb";
import Invoice from "../../../models/Invoice/invoiceModel";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const {
        title,
        invoiceIds,
        mergeType,
        discount = 0,
        serviceFee = 0,
      } = req.body;

      // 1) fetch all selected invoices
      const sources = await Invoice.find({ _id: { $in: invoiceIds } });
      const base = sources[0]; // pick one to copy common fields from

      // 2) merge items arrays
      const mergedItems = sources.flatMap((inv) => inv.items);

      // 3) combine all monetary fields
      let subtotal = 0,
        totalGST = 0;
      mergedItems.forEach((it) => {
        const lineAmount = it.rate * it.quantity * (1 - it.discount / 100);
        const gstAmt = (lineAmount * (it.cgst + it.sgst + it.igst)) / 100;
        subtotal += lineAmount;
        totalGST += gstAmt;
      });

      const grandTotal = subtotal + totalGST + serviceFee - discount;

      // 4) create the merged invoice
      const merged = await Invoice.create({
        // auto‐gen a new invoiceNumber, or derive one
        invoiceNumber: `MERGE-${Date.now()}`,

        // required dates/platform from one of the originals (or your merge form)
        invoiceDate: base.invoiceDate,
        dueDate: base.dueDate,
        platform: base.platform,

        // buyer / seller info
        buyerName: base.buyerName,
        buyerGSTIN: base.buyerGSTIN,
        buyerState: base.buyerState,
        sellerName: base.sellerName,
        sellerGSTIN: base.sellerGSTIN,
        sellerState: base.sellerState,

        // GST config
        gstType: base.gstType,
        globalCGST: base.globalCGST,
        globalSGST: base.globalSGST,
        globalIGST: base.globalIGST,

        // addresses, payment info, etc… copy whatever your schema requires
        billingAddress: base.billingAddress,
        shippingAddress: base.shippingAddress,
        amountPaid: base.amountPaid,
        // …

        // *then* your merge‐specific fields
        mergeTitle: title,
        mergeType: base.type,
        mergeDiscount: discount,
        mergeServiceFee: serviceFee,

        // finally the merged line‐items array you computed
        items: mergedItems,
      });

      return res.status(201).json(merged);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Merge failed", details: err });
    }
  }

  // Preview endpoint
  if (req.method === "POST" && req.url.includes("/preview")) {
    try {
      const { invoiceIds, discount = 0, serviceFee = 0 } = req.body;
      // const sources = await Invoice.find({ _id: { $in: invoiceIds } });
      const sources = await Invoice.find({ _id: { $in: invoiceIds } });
      if (originals.length === 0) {
        return res.status(400).json({ error: "No invoices to merge" });
      }
      const items = sources.flatMap((inv) => inv.items);
      let subtotal = 0,
        totalGST = 0;
      items.forEach((it) => {
        const lineAmount = it.rate * it.quantity * (1 - it.discount / 100);
        const gstAmt = (lineAmount * (it.cgst + it.sgst + it.igst)) / 100;
        subtotal += lineAmount;
        totalGST += gstAmt;
      });
      const grandTotal = subtotal + totalGST + serviceFee - discount;
      return res.json({
        items,
        subtotal,
        totalGST,
        serviceFee,
        discount,
        grandTotal,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Preview failed", details: err });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
