// crmnext/pages/api/cbv/index.js
import allowCors from "../../../middleware/cors";import { getAllCbv, createCbv } from "../../../controllers/Cbv/cbvController";
import dbConnect from "../../../lib/mongodb";

async function handler(req, res) {
  // 1) Run CORS
  await dbConnect();
  // 2) Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 3) Your existing logic
  if (req.method === "GET") {
    return getAllCbv(req, res);
  } else if (req.method === "POST") {
    return createCbv(req, res);
  } else {
    res.setHeader("Allow", "GET,POST,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default allowCors(handler)