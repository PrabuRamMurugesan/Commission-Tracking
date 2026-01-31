// pages/api/reports/cbavs.js
import dbConnect from "../../../lib/mongodb";
import { getAllCbv } from "../../../controllers/Cbv/cbvController";
import handleCors from "../../../lib/cors";

export default async function handler(req, res) {
  await handleCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    // Use the same controller as /api/cbav which fetches from both CRM and BBSCART
    await getAllCbv(req, res);
  } catch (error) {
    console.error("CBAV Report API Error:", error);
    res.status(500).json({ 
      success: false,
      error: "Server Error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined 
    });
  }
}
