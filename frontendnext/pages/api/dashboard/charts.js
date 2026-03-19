import dbConnect from "../../../lib/mongodb";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    // Return placeholder chart data; replace with real model if needed
    const data = [];
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Dashboard charts error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export default allowCors(handler);