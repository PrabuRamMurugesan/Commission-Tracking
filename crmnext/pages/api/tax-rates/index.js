import dbConnect from "../../../lib/mongodb";
import {
  createTaxRate,
  getTaxRates,
  updateTaxRate,
  deleteTaxRate,
} from "../../../controllers/taxController";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") return getTaxRates(req, res);
  if (req.method === "POST") return createTaxRate(req, res);
  if (req.method === "PUT") return updateTaxRate(req, res);
  if (req.method === "DELETE") return deleteTaxRate(req, res);

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
