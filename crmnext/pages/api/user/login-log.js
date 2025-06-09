import dbConnect from "../../../lib/mongodb";
import LoginLog from "../../../models/LoginLog";
import handleCors from "../../../lib/cors";

export default async function handler(req, res) {
  await handleCors(req, res);
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.body;

  try {
    const logs = await LoginLog.find({ email })
      .sort({ loginTime: -1 })
      .limit(10);
    res.status(200).json({ logs });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
}
