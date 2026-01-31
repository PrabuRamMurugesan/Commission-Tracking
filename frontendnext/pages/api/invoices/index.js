// pages/api/invoices/index.js
import dbConnect from "../../../lib/mongodb";
import Invoice from "../../../models/Invoice/invoiceModel";
import { createInvoice } from "../../../controllers/invoiceController";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    return createInvoice(req, res);
  }

  if (req.method === "GET") {
    try {
      // 1) pull all filter params
      const {
        invoiceId,
        customer,
        gstin,
        platform,
        role,
        paymentStatus,
        fromDate,
        toDate,
        invoiceType,
        gstType,
        gstSlab,
        paymentMethod,
        search,
      } = req.query;

      const query = {};

      // 2) invoiceId exact match
      if (invoiceId) {
        query.invoiceNumber = invoiceId;
      }

      // 3) free-text search (optional override)
      if (search) {
        const re = new RegExp(search, "i");
        query.$or = [{ invoiceNumber: re }, { buyerName: re }];
      }

      // 4) other advanced filters
      if (customer) query.buyerName = new RegExp(customer, "i");
      if (gstin) query.buyerGSTIN = new RegExp(gstin, "i");
      if (platform && platform !== "All") query.platform = platform;
      if (role && role !== "All") query.createdBy = role;
      if (invoiceType && invoiceType !== "All") query.invoiceType = invoiceType;
      if (paymentMethod && paymentMethod !== "All")
        query.paymentMode = paymentMethod;
      if (gstType && gstType !== "All") query.gstType = gstType;
      if (gstSlab && gstSlab !== "All") {
        const slabNum = Number(gstSlab.replace("%", ""));
        query.items = {
          $elemMatch: {
            $or: [{ cgst: slabNum }, { sgst: slabNum }, { igst: slabNum }],
          },
        };
      }

      // 5) paymentStatus
      if (paymentStatus && paymentStatus !== "All") {
        if (paymentStatus === "Paid") {
          query.$expr = { $gte: ["$amountPaid", "$grandTotal"] };
        } else if (paymentStatus === "Partial") {
          query.$expr = {
            $and: [
              { $gt: ["$amountPaid", 0] },
              { $lt: ["$amountPaid", "$grandTotal"] },
            ],
          };
        } else if (paymentStatus === "Unpaid") {
          query.amountPaid = 0;
        }
      }

      // 6) date range
      if (fromDate || toDate) {
        query.invoiceDate = {};
        if (fromDate) query.invoiceDate.$gte = new Date(fromDate);
        if (toDate) query.invoiceDate.$lte = new Date(toDate);
      }

      // 7) execute
      const invoices = await Invoice.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, invoices });
    } catch (error) {
      console.error("Fetch Invoices Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch invoices" });
    }
  }

  // Method not allowed
  res.setHeader("Allow", ["GET", "POST"]);
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
