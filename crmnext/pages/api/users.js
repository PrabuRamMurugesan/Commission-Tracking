const bcrypt = require("bcryptjs");
import connectMongo from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectMongo();
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const users = await User.find().select("-password"); // hide password
    return res.status(200).json({ users });
  } catch (error) {
    console.error("User fetch error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
