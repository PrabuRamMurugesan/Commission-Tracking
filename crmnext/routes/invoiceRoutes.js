// // routes/invoiceRoutes.js (or wherever your invoice endpoints live)
// import express from "express";
// import Escrow from "../models/Escrow/Escrow";

// const router = express.Router();

// // This line ensures GET /api/invoices/:id/audit goes to getAuditLog

// // your other routes…
// router.post("/", createInvoice);
// router.get("/:id", getInvoiceById);
// router.get("/:id/escrowInfo", async (req, res) => {
//   try {
//     const { id } = req.params;
//     // make sure the invoice actually exists
//     await Invoice.findById(id).orFail();
//     // now load the escrow record by invoiceId
//     const escrow = await Escrow.findOne({ invoiceId: id });
//     if (!escrow) {
//       return res.status(404).json({ error: "No escrow info found" });
//     }
//     res.json(escrow);
//   } catch (err) {
//     console.error("Escrow fetch error:", err);
//     // if it was a not-found
//     if (err.name === "DocumentNotFoundError") {
//       return res.status(404).json({ error: "Invoice not found" });
//     }
//     res.status(500).json({ error: "Escrow fetch failed" });
//   }
// });
// export default router;
