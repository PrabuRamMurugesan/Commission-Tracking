// pages/api/invoices/[id].js

import dbConnect from "../../../lib/mongodb";
import Invoice from "../../../models/Invoice/Invoice";

export default async function handler(req, res) {
  await dbConnect();

  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      try {
        const invoice = await Invoice.findById(id);
        if (!invoice) {
          return res
            .status(404)
            .json({ success: false, message: "Invoice not found" });
        }
        res.status(200).json({ success: true, data: invoice });
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
