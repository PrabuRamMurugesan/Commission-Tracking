import dbConnect from "../../../utils/dbConnect";
import PendingWork from "../../../models/PendingWork";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const pendingWorks = await PendingWork.find({});
      res.status(200).json({ success: true, data: pendingWorks });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
