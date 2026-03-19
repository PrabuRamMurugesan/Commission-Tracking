import dbConnect from "../../../lib/mongodb";
import LoginLog from "../../../models/LoginLog";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {
  await dbConnect();

  const { email } = req.method === "GET" ? req.query : req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const logs = await LoginLog.find({ email: { $regex: new RegExp(`^${email}$`, "i") } })
      .sort({ loginTime: -1 })
      .limit(50);
    res.status(200).json({ logs });
  } catch (err) {
    console.error("Login log error:", err);
    res.status(500).json({ message: "Error", error: err.message });
  }
}

export default allowCors(handler);
