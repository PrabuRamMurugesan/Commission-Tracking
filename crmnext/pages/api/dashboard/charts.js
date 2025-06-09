import dbConnect from "../../../utils/dbConnect";
import Widget from "../../../models/Widget";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const widgets = await Widget.find({});
      res.status(200).json({ success: true, data: widgets });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
