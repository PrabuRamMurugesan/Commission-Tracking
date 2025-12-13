import dbConnect from "../../../utils/dbConnect";
import Notice from "../../../models/Notice";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const notices = await Notice.find({});
      res.status(200).json({ success: true, data: notices });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
