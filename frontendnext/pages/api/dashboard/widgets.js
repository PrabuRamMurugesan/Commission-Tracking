import dbConnect from "../../../lib/mongodb";
import Widget from "../../../models/Widget";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    const widgets = await Widget.find({}).lean().catch(() => []);
    return res.status(200).json({ success: true, data: widgets });
  } catch (error) {
    console.error("Dashboard widgets error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export default allowCors(handler);