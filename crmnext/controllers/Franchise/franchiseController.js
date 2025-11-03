import Francise from "../../models/Franchise/Francise.js";
import bcrypt from "bcryptjs";
import { getBBSliveDb } from "../../lib/db.js";
import { validateFrancisePayload } from "../../utils/validateFranchise.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// ✅ GET All Francises (optionally by franchiseeId or platform)
export const getAllFranchises = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection("franchiseheads");
    const { franchiseeId, platform } = req.query;
    const filter = {};

    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    const francise = await col
      .find(filter, {
        projection: {
          name: 1, email: 1, phone: 1, platform: 1, zone: 1, status: 1,
          bpc: 1, totalCustomers: 1, totalTransactions: 1,
          commissionEarned: 1, commissionPending: 1, joinedDate: 1,
        },
      })
      .sort({ joinedDate: -1 })
      .limit(500)
      .toArray();
    res.status(200).json({ francise });
  } catch (error) {
    console.error("Error fetching francise:", error);
    res.status(500).json({ message: "Failed to fetch francise" });
  }
};

// ✅ GET Single Francise by ID
export const getFranciseById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const francise = await Francise.findById(id);
    if (!francise)
      return res.status(404).json({ message: "Francise not found" });

    res.status(200).json({ francise });
  } catch (error) {
    console.error("Get francise error:", error);
    res.status(500).json({ message: "Failed to fetch francise" });
  }
};

// ✅ POST Create New Francise
export const createFranchise = async (req, res) => {
  try {
    await connectDB();

    const {
      name,
      email,
      phone,
      whatsappNumber,
      password,
      profilePic,
      designation,
      zone,
      platform,
      commissionRates,
      franchiseeId,
      stateCode,
      cityCode,
    } = req.body;
    // ✅ Generate BPC properly here
    const count = await Francise.countDocuments({ stateCode, cityCode });

    const bpc = generateLocationPartnerCode({
      role: "franchise",
      stateCode,
      cityCode,
      createdAt: new Date(),
      count,
    });

    // Basic validation
    if (!name || !email || !password || !phone || !franchiseeId || !platform) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if email already exists
    const existing = await Francise.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Francise with this email already exists" });
    }

    const { valid, missing } = validateFrancisePayload(req.body);
    if (!valid) {
      return res.status(400).json({
        message: `Missing or invalid fields: ${missing.join(", ")}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const francise = new Francise({
      name,
      email,
      phone,
      whatsappNumber,
      password: hashedPassword,
      profilePic,
      designation,
      zone,
      platform,
      commissionRates,
      franchiseeId,
      businessPartnerCode: bpc,
      stateCode,
      cityCode,
    });

    await francise.save();

    res
      .status(201)
      .json({ message: "Francise created successfully", francise });
  } catch (error) {
    console.error("Create francise error:", error);
    res.status(500).json({ message: "Failed to create francise" });
  }
};

// ✅ PUT Update Francise Info
export const updateFranchise = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const updatedFrancise = await Francise.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedFrancise) {
      return res.status(404).json({ message: "Francise not found" });
    }

    res
      .status(200)
      .json({ message: "Francise updated", francise: updatedFrancise });
  } catch (error) {
    console.error("Update francise error:", error);
    res.status(500).json({ message: "Failed to update francise" });
  }
};

// ✅ DELETE (Deactivate or Remove)
export const deleteFranchise = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const deleted = await Francise.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Francise not found" });
    }

    res
      .status(200)
      .json({ message: "Francise deactivated", francise: deleted });
  } catch (error) {
    console.error("Delete francise error:", error);
    res.status(500).json({ message: "Failed to deactivate francise" });
  }
};
