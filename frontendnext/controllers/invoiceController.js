import Invoice from "../models/Invoice.js";
import validateInvoiceInput from "../utils/validateInvoiceInput.js";

export const createInvoice = async (req, res) => {
  const { isValid, errors } = validateInvoiceInput(req.body);

  if (!isValid) {
    return res.status(400).json({ success: false, errors });
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
};
