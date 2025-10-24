
// /pages/api/invoices/[id]/escrowInfo.js
import { getEscrowInfo } from "../../../../../controllers/escrowController";
import { connectDB } from "../../../../../lib/db";
import { authMiddleware } from "../../../../../middleware/authMiddleware";
import { roleMiddleware } from "../../../../../middleware/roleMiddleware";
import handleCors from "../../../../../lib/cors"; // ✅ must be first

// 🔧 Base handler logic (business logic only)
async function baseHandler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    return getEscrowInfo(req, res);
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

// ✅ Wrap with CORS, then Auth, then Role check
export default async function handler(req, res) {
  await handleCors(req, res); // always apply first
  const protectedHandler = authMiddleware(
    roleMiddleware(["admin", "vendor"])(baseHandler)
  ); // change roles as needed
  return protectedHandler(req, res);
}
