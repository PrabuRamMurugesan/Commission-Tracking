// crmnext/pages/api/vendor/index.js
import Cors from "cors";
import {
  getAllVendor,
  createVendor,
} from "../../../controllers/Vendor/vendorController";
import dbConnect from "../../../lib/mongodb";

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) =>
    fn(req, res, (err) => (err ? reject(err) : resolve()))
  );
}

// Initialize the cors middleware
const cors = Cors({
  origin:        "http://localhost:5173",
  methods:       ["POST","OPTIONS"],
  credentials:   true,
  allowedHeaders:["Content-Type","Authorization"],
});

export default async function handler(req, res) {
  // 1) Run CORS
  await dbConnect();
  await runMiddleware(req, res, cors);
  // 2) Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 3) Your existing logic
  if (req.method === "GET") {
    return getAllVendor(req, res);
  } else if (req.method === "POST") {
    return createVendor(req, res);
  } else {
    res.setHeader("Allow", "GET,POST,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
