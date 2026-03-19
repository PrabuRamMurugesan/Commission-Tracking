import allowCors from "../../../middleware/cors";
import jwt from "jsonwebtoken";
import dbConnect from "../../../utils/dbConnect";
import { getFilteredTransactionsFromBBSlive } from "../../../controllers/transactionController";

async function handler(req, res) {
  // 1) DB
  await dbConnect();

 if (req.method !== "GET") {
    res.setHeader("Allow", "GET,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
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

export default allowCors(handler)