import dbConnect from "../../../utils/dbConnect";
import WorkDeadline from "../../../models/WorkDeadline";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const deadlines = await WorkDeadline.find({});
      res.status(200).json({ success: true, data: deadlines });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
