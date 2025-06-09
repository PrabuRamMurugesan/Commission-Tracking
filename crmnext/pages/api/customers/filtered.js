import Cors from "cors";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import { getCustomersByRole } from "../../../controllers/common/getCustomersByRole";

// 1) CORS config
const cors = Cors({
  origin: "http://localhost:5173",
  methods: ["GET", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) =>
    fn(req, res, (err) => (err ? reject(err) : resolve()))
  );
}

export default async function handler(req, res) {
  const { role: queryRole, userId: queryUserId } = req.query;

  // connect to Mongo
  await dbConnect();

  // run CORS on all requests
  await runMiddleware(req, res, cors);

  // preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // only GET for this route
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).end("Method Not Allowed");
  }

  // auth
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let payload;
  try {
    payload = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  // role guard
  const user = { _id: payload._id, role: payload.role };
  const ALLOWED = [
    "admin",
    "territory-head",
    "franchisee",
    "agent",
    "vendor",
    "cbv",
    "franchise"
  ];
  if (!ALLOWED.includes(user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // fetch & return
  try {
    const customers = await getCustomersByRole({
      _id: queryUserId || user._id,
      role: queryRole || user.role,
    });
    console.log("🍪 filtered response:", customers);
    return res.status(200).json({ customers });
  } catch (err) {
    console.error("Error in filtered API:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
