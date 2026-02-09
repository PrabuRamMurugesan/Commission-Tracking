import Cors from "cors";
import jwt from "jsonwebtoken";
import dbConnect from "../../../utils/dbConnect";
import { getFilteredTransactionsFromBBSlive } from "../../../controllers/transactionController";

// CORS config (same as customers)
const cors = Cors({
  origin: "http://localhost:5174",
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
  // 1) DB
  await dbConnect();

  // 2) CORS
  await runMiddleware(req, res, cors);

  // 3) Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 4) Only GET allowed
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).end("Method Not Allowed");
  }

  // 5) Auth
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

  // 6) User info from token
  const user = {
    _id: payload._id,
    role: payload.role,
    vendorId: payload.vendorId,
    franchiseId: payload.franchiseId,
    agentId: payload.agentId,
    territoryId: payload.territoryId,
  };

  const ALLOWED = [
    "admin",
    "territory-head",
    "franchisee",
    "agent",
    "vendor",
    "cbv",
    "franchise",
    "logistics-partner",
    "health-partner",
  ];

  if (!ALLOWED.includes(user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // 7) Decide effective role & userId
  const { role: queryRole, userId: queryUserId } = req.query;

  const effectiveRole = queryRole || user.role;
  let effectiveUserId = queryUserId || "";

  if (!effectiveUserId) {
    if (effectiveRole === "vendor" && user.vendorId) {
      effectiveUserId = user.vendorId;
    } else {
      effectiveUserId = user._id;
    }
  }

  req.query.role = effectiveRole;
  req.query.userId = effectiveUserId;

  // 8) Delegate to BBSlive controller
  return getFilteredTransactionsFromBBSlive(req, res);
}
