import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import handleCors from "../../../lib/cors";

export default async function handler(req, res) {
  await handleCors(req, res);
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
