import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Vendor from "../../../models/Vendor/Vendor";
import Agent from "../../../models/Agent/Agent";
import FranchiseHead from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {
  await dbConnect();

  const { email, address, index } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find user in User collection first
    let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
    let userModel = User;
    let userId = null;

    if (!user) {
      // Check Vendor collection
      const vendor = await Vendor.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
      if (vendor) {
        user = vendor;
        userModel = Vendor;
        userId = vendor._id;
      } else {
        // Check Agent collection
        const agent = await Agent.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
        if (agent) {
          user = agent;
          userModel = Agent;
          userId = agent._id;
        } else {
          // Check FranchiseHead collection
          const franchise = await FranchiseHead.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
          if (franchise) {
            user = franchise;
            userModel = FranchiseHead;
            userId = franchise._id;
          } else {
            // Check TerritoryHead collection
            const territory = await TerritoryHead.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
            if (territory) {
              user = territory;
              userModel = TerritoryHead;
              userId = territory._id;
            } else {
              return res.status(404).json({ message: "User not found" });
            }
          }
        }
      }
    } else {
      userId = user._id;
    }

    if (req.method === "PUT") {
      // Add new address
      if (!address || !address.street || !address.city || !address.state || !address.country || !address.pincode) {
        return res.status(400).json({ message: "All address fields are required" });
      }

      if (!user.addresses) {
        user.addresses = [];
      }

      user.addresses.push({
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        pincode: address.pincode,
        createdAt: new Date(),
      });

      await user.save();
      return res.status(200).json({ message: "Address added successfully", addresses: user.addresses });
    }

    if (req.method === "DELETE") {
      // Delete address by index
      if (typeof index !== "number" || index < 0) {
        return res.status(400).json({ message: "Valid address index is required" });
      }

      if (!user.addresses || !user.addresses[index]) {
        return res.status(404).json({ message: "Address not found" });
      }

      user.addresses.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (err) {
    console.error("Address API error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

export default allowCors(handler);
