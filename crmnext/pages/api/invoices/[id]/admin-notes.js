// pages/api/invoices/[invoiceId]/admin-notes.js

import dbConnect from "../../../../lib/mongodb";
import {
  getAdminNotes,
  createAdminNote,
} from "../../../../controllers/invoiceController";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const notes = await getAdminNotes(id);
        return res.status(200).json(notes);
      } catch (err) {
        console.error("GET /admin-notes error:", err);
        return res.status(500).json({ error: "Failed to fetch admin notes" });
      }

    case "POST":
      try {
        // if you expect JSON:
        // const note = await addAdminNote(invoiceId, req.body);
        // if you expect multipart/form-data (file upload):
        // you’ll need to parse it first (e.g. with multer).
        // For now, assume pure JSON:
        const note = await createAdminNote(id, req.body);
        return res.status(201).json(note);
      } catch (err) {
        console.error("POST /admin-notes error:", err);
        return res.status(500).json({ error: "Failed to create admin note" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
