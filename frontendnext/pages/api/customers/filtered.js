import allowCors from "../../../middleware/cors";
import jwt from "jsonwebtoken";
import dbConnect from "../../../lib/mongodb";
import { getFilteredCustomersFromBBSlive } from "../../../controllers/Customer/customerController";

async function handler(req, res) {
  const { role: queryRole, userId: queryUserId } = req.query;

  // 1) DB
  await dbConnect();
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
    vendorId: payload.vendorId, // if you added this to the token
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

  // 7) Decide effective role and userId for filtering
  const effectiveRole = queryRole || user.role;
  let effectiveUserId = queryUserId || "";

  if (!effectiveUserId) {
    if (effectiveRole === "vendor" && user.vendorId) {
      // Vendor dashboard should use BBSCART vendorId
      effectiveUserId = user.vendorId;
    } else {
      // For admin, territory-head, franchisee, agent, etc
      effectiveUserId = user._id;
    }
  }

  // Make sure controller sees the final values
  req.query.role = effectiveRole;
  req.query.userId = effectiveUserId;

  // 8) Delegate to the BBSlive-based controller
  return getFilteredCustomersFromBBSlive(req, res);
}

export default allowCors(handler)