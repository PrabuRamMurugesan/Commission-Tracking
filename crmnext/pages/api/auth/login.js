import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import handleCors from "../../../lib/cors";
import LoginLog from "../../../models/LoginLog";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await handleCors(req, res); // ✅ handle OPTIONS requests

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // ✅ reply to preflight check
  }

  try {
    await dbConnect();

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // ✅ Generate token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    const userAgent = req.headers["user-agent"];
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    await LoginLog.create({
      userId: user._id,
      email: user.email,
      role: user.role,
      userAgent,
      ipAddress,
    });

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
