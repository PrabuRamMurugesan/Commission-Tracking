import dbConnect from "../../../utils/dbConnect";
import OlaMapLocation from "../../../models/OlaMapLocation";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const locations = await OlaMapLocation.find({});
      res.status(200).json({ success: true, data: locations });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
