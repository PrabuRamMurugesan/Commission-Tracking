import connectMongo from "../../../lib/mongodb";
import CommissionTier from "../../../models/Commission/CommissionTier";

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === "POST") {
    try {
      const { role, platform, tiers } = req.body;

      if (!role || !platform || !Array.isArray(tiers)) {
        return res.status(400).json({ message: "Invalid request format" });
      }

      // Delete existing tiers first (replace mode)
      await CommissionTier.deleteMany({ role, platform });

      const created = await CommissionTier.insertMany(
        tiers.map((tier) => ({ ...tier, role, platform }))
      );

      return res
        .status(200)
        .json({ message: "Tiers saved", count: created.length });
    } catch (err) {
      console.error("Tier POST error:", err);
      return res.status(500).json({ message: "Failed to save tiers" });
    }
  }

  if (req.method === "GET") {
    try {
      const { role, platform } = req.query;
      if (!role || !platform)
        return res.status(400).json({ message: "Missing params" });

      const tiers = await CommissionTier.find({ role, platform });
      return res.status(200).json(tiers);
    } catch (err) {
      console.error("Tier GET error:", err);
      return res.status(500).json({ message: "Failed to fetch tiers" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
