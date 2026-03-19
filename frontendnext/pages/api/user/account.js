import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {
  await dbConnect();

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.body;
  try {
    await User.findOneAndUpdate({ email }, { accountStatus: "inactive" });
    res.status(200).json({ message: "Account deactivated" });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
}

export default allowCors(handler);