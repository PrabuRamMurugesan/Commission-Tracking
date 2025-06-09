import dbConnect from "../../../utils/dbConnect";
import Announcement from "../../../models/Announcement";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const announcements = await Announcement.find({});
      res.status(200).json({ success: true, data: announcements });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}
