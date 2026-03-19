import allowCors from "../../../middleware/cors";
import { getAllCbv, createCbv } from "../../../controllers/Cbv/cbvController";
import dbConnect from "../../../lib/mongodb";

async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    return getAllCbv(req, res);
  }

  if (req.method === "POST") {
    return createCbv(req, res);
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  res.setHeader("Allow", "GET,POST,OPTIONS");
  return res.status(405).json({ message: "Method Not Allowed" });
}

export default allowCors(handler);