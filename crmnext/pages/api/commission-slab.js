import connectMongo from "../../lib/mongodb";
import CommissionSlab from "../../models/Commission/CommissionSlab"

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === "POST") {
    try {
      const {
        platform,
        role,
        slabType,
        commissionType,
        commissionValue,
        commissionPercentage,
        minValue,
        maxValue,
      } = req.body;

      // Validate required fields
      if (!platform || !role || !slabType || !commissionType) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate commission type
      if (
        commissionType === "flat" &&
        (commissionValue === undefined || commissionValue === null)
      ) {
        return res
          .status(400)
          .json({ message: "Flat commission value required" });
      }

      if (
        commissionType === "percentage" &&
        (commissionPercentage === undefined || commissionPercentage === null)
      ) {
        return res
          .status(400)
          .json({ message: "Commission percentage required" });
      }

      const newSlab = await CommissionSlab.create({
        platform,
        role,
        slabType,
        commissionType,
        commissionValue:
          commissionType === "flat" ? parseFloat(commissionValue) : undefined,
        commissionPercentage:
          commissionType === "percentage"
            ? parseFloat(commissionPercentage)
            : undefined,
        minValue: parseFloat(minValue) || 0,
        maxValue: parseFloat(maxValue) || 0,
      });

      return res
        .status(201)
        .json({ message: "Commission Slab Created", slab: newSlab });
    } catch (err) {
      console.error("POST Slab error:", err);
      return res
        .status(500)
        .json({ message: "Error saving slab", error: err.message });
    }
  }
  

  if (req.method === "GET") {
    try {
      const slabs = await CommissionSlab.find(req.query); // Can filter by role, platform, slabType, etc.
      return res.status(200).json(slabs);
    } catch (err) {
      console.error("GET Slab error:", err);
      return res.status(500).json({ message: "Error fetching slabs" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
