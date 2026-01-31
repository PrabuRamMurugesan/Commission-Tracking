import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Vendor from "../../../models/Vendor/Vendor";
import Agent from "../../../models/Agent/Agent";
import FranchiseHead from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
import handleCors from "../../../lib/cors";

export default async function handler(req, res) {
  await handleCors(req, res);
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email query param is required" });
  }

  try {
    // Normalize email to lowercase for case-insensitive search
    const normalizedEmail = email.trim().toLowerCase();

    // Check User collection first
    let user = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });

    if (!user) {
      // Check Vendor collection
      const vendor = await Vendor.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
      if (vendor) {
        // Convert vendor to user-like object
        user = {
          ...vendor.toObject(),
          role: "vendor",
          profileImage: vendor.profilePic || "",
          addresses: vendor.addresses || [],
        };
      } else {
        // Check Agent collection
        const agent = await Agent.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
        if (agent) {
          user = {
            ...agent.toObject(),
            role: "agent",
            profileImage: agent.profilePic || "",
            addresses: agent.addresses || [],
          };
        } else {
          // Check FranchiseHead collection
          const franchise = await FranchiseHead.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
          if (franchise) {
            user = {
              ...franchise.toObject(),
              role: "franchisee",
              profileImage: franchise.profilePic || "",
              addresses: franchise.addresses || [],
            };
          } else {
            // Check TerritoryHead collection
            const territory = await TerritoryHead.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } });
            if (territory) {
              user = {
                ...territory.toObject(),
                role: "territory",
                profileImage: territory.profilePic || "",
                addresses: territory.addresses || [],
              };
            } else {
              return res.status(404).json({ message: "User not found" });
            }
          }
        }
      }
    }

    // Remove password from response
    const userResponse = { ...user.toObject ? user.toObject() : user };
    delete userResponse.password;

    res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error("Profile API error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
