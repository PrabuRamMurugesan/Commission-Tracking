// pages/api/invoices/downloadOptions.js
import dbConnect from "../../../lib/mongodb";
import Invoice from "../../../models/Invoice/invoiceModel";
import { Parser as CsvParser } from "json2csv";
import PDFDocument from "pdfkit";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const {
    format,
    platform,
    role,
    fileName = `Invoice_Export_${Date.now()}`,
    includeWatermark,
    includePlatformHeader,
    enablePageNumbers,
    notes,
    layout,
  } = req.body;

  // 1️⃣ Fetch invoices (filter by platform if requested)
  const filter = platform && platform !== "All" ? { platform } : {};
  const invoices = await Invoice.find(filter).lean();

  // 2️⃣ Branch on format
  if (format === "CSV") {
    // Build CSV
    const fields = [
      "invoiceNumber",
      "invoiceDate",
      "dueDate",
      "platform",
      "invoiceType",
      "buyerName",
      "sellerName",
      "subtotal",
      "totalGST",
      "grandTotal",
      "amountPaid",
    ];
    const parser = new CsvParser({ fields });
    const csv = parser.parse(invoices);

    // Send CSV response
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}.csv"`
    );
    return res.status(200).send(csv);
  }

  if (format === "PDF") {
    // Stream a simple PDF using PDFKit
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}.pdf"`
    );

    const doc = new PDFDocument({ autoFirstPage: false });
    doc.pipe(res);

    invoices.forEach((inv, idx) => {
      doc.addPage({ size: layout === "Compact" ? "A5" : "A4" });

      if (includePlatformHeader) {
        doc
          .fontSize(20)
          .text("Commission Tracking System", { align: "center" })
          .moveDown(0.5);
      }

      if (includeWatermark) {
        doc
          .fontSize(80)
          .opacity(0.1)
          .text(
            inv.amountPaid >= inv.grandTotal ? "PAID" : "DRAFT",
            doc.page.width / 2 - 200,
            doc.page.height / 2 - 50
          )
          .opacity(1);
      }

      doc
        .fontSize(14)
        .text(`Invoice #: ${inv.invoiceNumber}`, { continued: true })
        .text(`   Date: ${inv.invoiceDate.toISOString().slice(0, 10)}`, {
          align: "right",
        })
        .moveDown(0.5)
        .text(`Platform: ${inv.platform}`)
        .text(`Role: ${role}`)
        .moveDown();

      // Table header
      doc.fontSize(12).text("— Invoice Details —").moveDown(0.2);
      Object.entries({
        Buyer: inv.buyerName,
        Seller: inv.sellerName,
        Subtotal: `₹${inv.subtotal}`,
        GST: `₹${inv.totalGST}`,
        "Grand Total": `₹${inv.grandTotal}`,
      }).forEach(([k, v]) =>
        doc.text(`${k}: ${v}`, { continued: true }).text(" ")
      );

      if (notes) {
        doc.moveDown().fontSize(10).text(`Notes: ${notes}`);
      }

      // Page numbers
      if (enablePageNumbers) {
        const bottom = doc.page.height - 50;
        doc
          .fontSize(8)
          .text(`Page ${idx + 1} of ${invoices.length}`, 50, bottom, {
            width: doc.page.width - 100,
            align: "center",
          });
      }
    });

    return doc.end();
  }

  // Unknown format
  return res
    .status(400)
    .json({ success: false, message: "Unsupported format" });
}
