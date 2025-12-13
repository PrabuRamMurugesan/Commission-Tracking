// backend/routes/api/invoice.js

const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../../controllers/invoiceController");
const { validateInvoice } = require("../../middleware/invoiceValidation");

// ✅ Create Invoice
router.post("/create", validateInvoice, createInvoice);

// ✅ Get all invoices (admin / vendor-based filtering will be applied inside controller)
router.get("/", getInvoices);

// ✅ Get invoice by ID
router.get("/:id", getInvoiceById);

// ✅ Update invoice
router.put("/:id", validateInvoice, updateInvoice);

// ✅ Delete invoice
router.delete("/:id", deleteInvoice);

module.exports = router;
