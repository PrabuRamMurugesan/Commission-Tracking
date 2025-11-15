import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import handleCors from "../../../lib/cors";
import LoginLog from "../../../models/LoginLog";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await handleCors(req, res); // handle OPTIONS + CORS

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    await dbConnect();

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // 1) Normalize email
    const rawEmail = (req.body?.email || "").toString();
    const email = rawEmail.trim().toLowerCase();
    const password = (req.body?.password || "").toString();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2) Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 3) Check password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 4) Figure out linkage ids
    // In DB we currently store partner link as "franchiseId" (and maybe not "franchiseeId")
    const franchiseLink = user.franchiseId || user.franchiseeId || null; // <-- important
    const territoryLink = user.territoryId || user.territoryHeadId || null;
    const agentLink = user.agentId || null;
    const vendorLink = user.vendorId || null;

    // 5) Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        franchiseeId: franchiseLink,
        territoryId: territoryLink,
        agentId: agentLink,
        vendorId: vendorLink,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    // 6) Send JSON back to frontend
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        franchiseeId: franchiseLink, // <-- frontend will now receive this
        territoryId: territoryLink,
        agentId: agentLink,
        vendorId: vendorLink,
      },
    });

    // 7) Log the login (optional)
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
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
