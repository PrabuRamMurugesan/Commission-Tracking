import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import handleCors from "../../../lib/cors";

export default async function handler(req, res) {
  await handleCors(req, res);
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email query param is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
