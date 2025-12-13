import dbConnect from "../../../utils/dbConnect";
import WeeklyEarning from "../../../models/WeeklyEarning";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const weeklyEarnings = await WeeklyEarning.find({});
      res.status(200).json({ success: true, data: weeklyEarnings });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
