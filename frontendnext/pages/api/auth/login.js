import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Vendor from "../../../models/Vendor/Vendor";
import Agent from "../../../models/Agent/Agent";
import FranchiseHead from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
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

    // 2) Find user - check User collection first, then Vendor, Agent, FranchiseHead, TerritoryHead
    // Use case-insensitive email search
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
      // Found in User collection
      userRole = user.role;
      userPassword = user.password;
      userId = user._id;
      userName = user.name;
      userEmail = user.email;
      franchiseLink = user.franchiseId || user.franchiseeId || null;
      territoryLink = user.territoryId || user.territoryHeadId || null;
      agentLink = user.agentId || null;
      vendorLink = user.vendorId || null;
      
      // Check if password exists for user
      if (!userPassword) {
        return res.status(400).json({ message: "Password not set for this account. Please reset your password." });
      }
    } else {
      // Check Vendor collection
      const vendor = await Vendor.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
      if (vendor) {
        // Check account status
        if (vendor.accountStatus === "inactive" || vendor.accountStatus === "suspended") {
          return res.status(400).json({ message: "Account is inactive or suspended" });
        }
        userRole = "vendor";
        userPassword = vendor.password;
        userId = vendor._id;
        userName = vendor.name;
        userEmail = vendor.email;
        franchiseLink = vendor.franchiseeId || null;
        vendorLink = vendor._id;
      } else {
        // Check Agent collection
        const agent = await Agent.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
        if (agent) {
          // Check account status
          if (agent.accountStatus === "inactive" || agent.accountStatus === "suspended") {
            return res.status(400).json({ message: "Account is inactive or suspended" });
          }
          userRole = "agent";
          userPassword = agent.password;
          userId = agent._id;
          userName = agent.name;
          userEmail = agent.email;
          franchiseLink = agent.franchiseeId || null;
          agentLink = agent._id;
        } else {
          // Check FranchiseHead collection
          const franchise = await FranchiseHead.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
          if (franchise) {
            // Check account status
            if (franchise.accountStatus === "inactive" || franchise.accountStatus === "suspended") {
              return res.status(400).json({ message: "Account is inactive or suspended" });
            }
            userRole = "franchisee";
            userPassword = franchise.password;
            userId = franchise._id;
            userName = franchise.name;
            userEmail = franchise.email;
            franchiseLink = franchise.franchiseeId || null;
          } else {
            // Check TerritoryHead collection
            const territory = await TerritoryHead.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
            if (territory) {
              // Check account status
              if (territory.accountStatus === "inactive" || territory.accountStatus === "suspended") {
                return res.status(400).json({ message: "Account is inactive or suspended" });
              }
              userRole = "territory";
              userPassword = territory.password;
              userId = territory._id;
              userName = territory.name;
              userEmail = territory.email;
              franchiseLink = territory.franchiseeId || null;
              territoryLink = territory._id;
            } else {
              return res.status(400).json({ message: "User not found" });
            }
          }
        }
      }
    }

    // 3) Check password
    if (!userPassword) {
      return res.status(400).json({ message: "Password not set for this account" });
    }
    
    const isMatch = await bcrypt.compare(password, userPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4) Create JWT
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

    // 5) Send JSON back to frontend
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        role: userRole,
        franchiseeId: franchiseLink,
        territoryId: territoryLink,
        agentId: agentLink,
        vendorId: vendorLink,
      },
    });

    // 6) Log the login (optional)
    const userAgent = req.headers["user-agent"];
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    await LoginLog.create({
      userId: userId,
      email: userEmail,
      role: userRole,
      userAgent,
      ipAddress,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
