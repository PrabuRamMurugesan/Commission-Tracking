import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Vendor from "../../../models/Vendor/Vendor";
import Agent from "../../../models/Agent/Agent";
import FranchiseHead from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
import bcrypt from "bcryptjs";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {
  await dbConnect();

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Email, current password, and new password are required" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // Check User collection first
    let user = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });

    if (!user) {
      // Check Vendor collection
      const vendor = await Vendor.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
      if (vendor) {
        user = vendor;
      } else {
        // Check Agent collection
        const agent = await Agent.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
        if (agent) {
          user = agent;
        } else {
          // Check FranchiseHead collection
          const franchise = await FranchiseHead.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
          if (franchise) {
            user = franchise;
          } else {
            // Check TerritoryHead collection
            const territory = await TerritoryHead.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
            if (territory) {
              user = territory;
            } else {
              return res.status(404).json({ message: "User not found" });
            }
          }
        }
      }
    }

    if (!user.password) {
      return res.status(400).json({ message: "Password not set for this account" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Error updating password", error: err.message });
  }
}

export default allowCors(handler);