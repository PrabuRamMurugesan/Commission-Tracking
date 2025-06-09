import Cbv from "../../models/Cbv/Cbv.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateCbvPayload } from "../../utils/validateCbv.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// ✅ GET All cbv (optionally by franchiseeId or platform)
export const getAllCbv = async (req, res) => {
  try {
    await connectDB();

    const { franchiseeId, platform } = req.query;
    const filter = {};

    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    const cbv = await Cbv.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ cbv });
  } catch (error) {
    console.error("Error fetching cbv:", error);
    res.status(500).json({ message: "Failed to fetch cbv" });
  }
};

// ✅ GET Single Cbv by ID
export const getCbvById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const cbv = await Cbv.findById(id);
    if (!cbv) return res.status(404).json({ message: "Cbv not found" });

    res.status(200).json({ cbv });
  } catch (error) {
    console.error("Get Cbv error:", error);
    res.status(500).json({ message: "Failed to fetch Cbv" });
  }
};

// ✅ POST Create New Cbv
export const createCbv = async (req, res) => {
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
    const count = await Cbv.countDocuments({ stateCode, cityCode });

    const bpc = generateLocationPartnerCode({
      role: "cbv",
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
    const existing = await Cbv.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Cbv with this email already exists" });
    }

    const { valid, missing } = validateCbvPayload(req.body);
    if (!valid) {
      return res.status(400).json({
        message: `Missing or invalid fields: ${missing.join(", ")}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const cbv = new Cbv({
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

    await cbv.save();

    res.status(201).json({ message: "Cbv created successfully", cbv });
  } catch (error) {
    console.error("Create Cbv error:", error);
    res.status(500).json({ message: "Failed to create Cbv" });
  }
};

// ✅ PUT Update Cbv Info
export const updateCbv = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const updatedCbv = await Cbv.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCbv) {
      return res.status(404).json({ message: "Cbv not found" });
    }

    res.status(200).json({ message: "Cbv updated", cbv: updatedCbv });
  } catch (error) {
    console.error("Update Cbv error:", error);
    res.status(500).json({ message: "Failed to update Cbv" });
  }
};

// ✅ DELETE (Deactivate or Remove)
export const deleteCbv = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const deleted = await Cbv.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Cbv not found" });
    }

    res.status(200).json({ message: "Cbv deactivated", cbv: deleted });
  } catch (error) {
    console.error("Delete Cbv error:", error);
    res.status(500).json({ message: "Failed to deactivate Cbv" });
  }
};
