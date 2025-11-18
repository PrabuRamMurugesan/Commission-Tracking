import dbConnect from "../../../utils/dbConnect";
import HealthcarePartner from "../../../models/HealthcarePartner";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const partners = await HealthcarePartner.find().sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: partners.length,
        data: partners,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
