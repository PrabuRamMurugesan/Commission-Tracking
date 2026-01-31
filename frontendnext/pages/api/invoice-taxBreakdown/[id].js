import dbConnect from "../../../lib/mongodb";
import {
  updateTaxRow,
  deleteTaxRow,
} from "../../../controllers/taxController";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "PUT") {
    return updateTaxRow(req, res);
  }
  if (req.method === "DELETE") {
    return deleteTaxRow(req, res);
  }
  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
