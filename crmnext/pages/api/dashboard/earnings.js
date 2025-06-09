import dbConnect from "../../../utils/dbConnect";
import Earnings from "../../../models/Earnings";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const earnings = await Earnings.find({});
      res.status(200).json({ success: true, data: earnings });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
