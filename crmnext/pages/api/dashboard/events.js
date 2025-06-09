import dbConnect from "../../../utils/dbConnect";
import Event from "../../../models/Event";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const events = await Event.find({});
      res.status(200).json({ success: true, data: events });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
