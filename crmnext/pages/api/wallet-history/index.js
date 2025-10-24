// File: pages/api/wallet-history/index.js
import dbConnect from "../../../lib/mongodb";
import { getWalletHistory } from "../../../controllers/walletHistoryController";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    return getWalletHistory(req, res);
  }

  res.setHeader("Allow", ["GET"]);
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
