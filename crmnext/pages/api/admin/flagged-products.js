import {connectDB} from "../../../lib/db";
import { roleMiddleware } from "../../../middleware/roleMiddleware";
import { getFlaggedProducts } from "../../../controllers/flagController";

export default async function handler(req, res) {
  await connectDB();
  await roleMiddleware(req, res);

  if (req.method === "GET") {
    try {
      const flagged = await getFlaggedProducts();
      res.status(200).json({ success: true, flagged });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
