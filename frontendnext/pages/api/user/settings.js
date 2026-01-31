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

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, settings } = req.body;

  if (!email || !settings) {
    return res.status(400).json({ message: "Email and settings are required" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // Check User collection first
    let updated = await User.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
      { settings },
      { new: true }
    ).select("-password");

    if (!updated) {
      // Check Vendor collection
      const vendor = await Vendor.findOneAndUpdate(
        { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
        { settings },
        { new: true }
      );
      if (vendor) {
        updated = vendor;
      } else {
        // Check Agent collection
        const agent = await Agent.findOneAndUpdate(
          { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
          { settings },
          { new: true }
        );
        if (agent) {
          updated = agent;
        } else {
          // Check FranchiseHead collection
          const franchise = await FranchiseHead.findOneAndUpdate(
            { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
            { settings },
            { new: true }
          );
          if (franchise) {
            updated = franchise;
          } else {
            // Check TerritoryHead collection
            const territory = await TerritoryHead.findOneAndUpdate(
              { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
              { settings },
              { new: true }
            );
            if (territory) {
              updated = territory;
            } else {
              return res.status(404).json({ message: "User not found" });
            }
          }
        }
      }
    }

    // Remove password from response
    const userResponse = { ...updated.toObject ? updated.toObject() : updated };
    delete userResponse.password;

    res.status(200).json({ message: "Settings updated", user: userResponse });
  } catch (err) {
    console.error("Settings API error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
}
