// /pages/api/invoices/index.js
import dbConnect from "../../../utils/dbConnect";
import Invoice from "../../../models/Invoice/Invoice";
const generateInvoiceNumber = async () => {
  const prefix = "INV";
  const random = Math.floor(Math.random() * 100000);
  const invoiceNumber = `${prefix}${random}`;

  // Check if it already exists
  const existing = await Invoice.findOne({ invoiceNumber });
  if (existing) return await generateInvoiceNumber(); // try again

  return invoiceNumber;
};
export default async function handler(req, res) {
  // Function to generate a unique invoice number

  await dbConnect();
  if (req.method === "GET") {
    try {
      const invoices = await Invoice.find({});
      res.status(200).json({ success: true, invoices });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
  if (req.method === "POST") {
    if (req.method === "POST") {
      try {
        const invoice = await Invoice.create(req.body);
        res.status(200).json({ success: true, data: invoice });
      } catch (error) {
        console.error("Create Invoice Error:", error.message);
        res.status(400).json({ success: false, message: error.message });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    try {
      const {
        invoiceNumber,
        invoiceDate,
        platform,
        status,
        buyer,
        seller,
        items,
        payment,
        totalAmount,
        totalGST,
        grandTotal,
        notes,
        createdBy,
        dueDate,
      } = req.body;

      const statusTracker = [
        {
          status: "Created",
          updatedAt: new Date(),
          updatedBy: createdBy || { userId: null, role: "system" },
        },
      ];

      const invoice = await Invoice.create({
        invoiceNumber,
        invoiceDate,
        dueDate,
        platform,
        status,
        buyer,
        seller,
        items,
        payment,
        totalAmount,
        totalGST,
        grandTotal,
        notes,
        createdBy,
        statusTracker,
      });

      return res.status(201).json({ success: true, invoice });
    } catch (error) {
      console.error("Create Invoice Error:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
  const invoiceNumber = await generateInvoiceNumber(); // ✅ Backend-only
  const newInvoice = await Invoice.create({
    invoiceNumber,
    ...restOfInvoiceData,
  });
  return res
    .status(405)
    .json({ success: false, message: "Method Not Allowed" });
}
