import dbConnect from "../../../utils/dbConnect";
import Notification from "../../../models/Notification";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const notifications = await Notification.find({});
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
