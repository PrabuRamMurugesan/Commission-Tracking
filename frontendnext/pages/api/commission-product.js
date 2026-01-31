import connectMongo from "../../lib/mongodb";
import CommissionProduct from "../../models/Commission/ProductCommission";

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === "POST") {
    try {
      const { platform, role, productName, commissionType, commissionValue } =
        req.body;

      if (
        !platform ||
        !role ||
        !productName ||
        !commissionType ||
        commissionValue === undefined
      ) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const newCommission = await CommissionProduct.create({
        platform,
        role,
        productName,
        commissionType,
        commissionValue,
      });

      return res.status(201).json({
        message: "Product Commission Created",
        commission: newCommission,
      });
    } catch (err) {
      console.error("POST Product Commission error:", err);
      return res.status(500).json({
        message: "Error saving product commission",
        error: err.message,
      });
    }
  }

  if (req.method === "GET") {
    try {
      const commissions = await CommissionProduct.find({});
      return res.status(200).json(commissions);
    } catch (err) {
      console.error("GET Product Commission error:", err);
      return res
        .status(500)
        .json({ message: "Error fetching product commissions" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
