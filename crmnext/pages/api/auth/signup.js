// pages/api/signup.js
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  // ✅ Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*"); // Or specify frontend origin
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end(); // Stop here for OPTIONS
  }

  // ✅ Set CORS headers for other requests too
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await dbConnect();

    // Normalize role values to match User model enum
    const roleMapping = {
      franchise: "franchisee",
      "franchisee": "franchisee",
      "territory-head": "territory",
      "territory": "territory",
      "agent": "agent",
      "vendor": "vendor",
      "admin": "admin",
      "customer": "customer",
      "cbav": "cbav",
      "manager": "admin", // Map manager to admin if manager is not a valid role
    };

    const normalizedRole = roleMapping[role.toLowerCase()] || role.toLowerCase();

    // Validate that the normalized role is in the enum
    const validRoles = ["admin", "vendor", "franchisee", "territory", "agent", "cbav", "customer"];
    if (!validRoles.includes(normalizedRole)) {
      return res.status(400).json({ 
        message: `Invalid role. Valid roles are: ${validRoles.join(", ")}` 
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, role: normalizedRole });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: `Validation error: ${validationErrors.join(", ")}` 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    res.status(500).json({ message: "Server error" });
  }
}
