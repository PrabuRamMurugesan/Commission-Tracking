import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Vendor from "../../../models/Vendor/Vendor";
import Agent from "../../../models/Agent/Agent";
import FranchiseHead from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
import bcrypt from "bcryptjs";
import allowCors from "../../../middleware/cors";
import LoginLog from "../../../models/LoginLog";
import jwt from "jsonwebtoken";

async function handler(req, res) {

  try {
    await dbConnect();

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST,OPTIONS");
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const rawEmail = (req.body?.email || "").toString();
    const email = rawEmail.trim().toLowerCase();
    const password = (req.body?.password || "").toString();

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });

    let userRole = null;
    let userPassword = null;
    let userId = null;
    let userName = null;
    let userEmail = null;
    let franchiseLink = null;
    let territoryLink = null;
    let agentLink = null;
    let vendorLink = null;

    if (user) {
      userRole = user.role;
      userPassword = user.password;
      userId = user._id;
      userName = user.name;
      userEmail = user.email;
      franchiseLink = user.franchiseId || user.franchiseeId || null;
      territoryLink = user.territoryId || user.territoryHeadId || null;
      agentLink = user.agentId || null;
      vendorLink = user.vendorId || null;

      if (!userPassword) {
        return res.status(400).json({ message: "Password not set" });
      }
    } else {
      const vendor = await Vendor.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });

      if (!vendor) {
        return res.status(400).json({ message: "User not found" });
      }

      userRole = "vendor";
      userPassword = vendor.password;
      userId = vendor._id;
      userName = vendor.name;
      userEmail = vendor.email;
      franchiseLink = vendor.franchiseeId || null;
      vendorLink = vendor._id;
    }

    const isMatch = await bcrypt.compare(password, userPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: userId,
        email: userEmail,
        role: userRole,
        franchiseeId: franchiseLink,
        territoryId: territoryLink,
        agentId: agentLink,
        vendorId: vendorLink,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        role: userRole,
      },
    });

    await LoginLog.create({
      userId,
      email: userEmail,
      role: userRole,
      userAgent: req.headers["user-agent"],
      ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default allowCors(handler);