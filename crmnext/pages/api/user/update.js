import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import handleCors from "../../../lib/cors";

export default async function handler(req, res) {
  await handleCors(req, res);
  await dbConnect();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    email,
    name,
    phone,
    gender,
    profileImage,
    address,
    language,
    timezone,
  } = req.body;

  try {
    const updated = await User.findOneAndUpdate(
      { email },
      { name, phone, gender, profileImage, address, language, timezone },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
}
