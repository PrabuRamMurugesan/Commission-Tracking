import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Vendor from "../../../models/Vendor/Vendor";
import Agent from "../../../models/Agent/Agent";
import FranchiseHead from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {
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

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (gender) updateData.gender = gender;
    if (profileImage) updateData.profileImage = profileImage;
    if (language) updateData.language = language;
    if (timezone) updateData.timezone = timezone;
    if (profileImage) updateData.profilePic = profileImage; // For Vendor/Agent models

    // Check User collection first
    let updated = await User.findOneAndUpdate(
      { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
      updateData,
      { new: true }
    ).select("-password");

    if (!updated) {
      // Check Vendor collection
      const vendor = await Vendor.findOneAndUpdate(
        { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
        updateData,
        { new: true }
      );
      if (vendor) {
        updated = vendor;
      } else {
        // Check Agent collection
        const agent = await Agent.findOneAndUpdate(
          { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
          updateData,
          { new: true }
        );
        if (agent) {
          updated = agent;
        } else {
          // Check FranchiseHead collection
          const franchise = await FranchiseHead.findOneAndUpdate(
            { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
            updateData,
            { new: true }
          );
          if (franchise) {
            updated = franchise;
          } else {
            // Check TerritoryHead collection
            const territory = await TerritoryHead.findOneAndUpdate(
              { email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") } },
              updateData,
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

    res.status(200).json({ message: "Profile updated", user: userResponse });
  } catch (err) {
    console.error("Update API error:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
}

export default allowCors(handler);
