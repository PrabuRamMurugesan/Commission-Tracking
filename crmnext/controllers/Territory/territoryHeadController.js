import Territory from "../../models/Territory/TerritoryHead.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateTerritoryPayload } from "../../utils/validateTerritoryHead.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// ✅ GET All territory (optionally by franchiseeId or platform)
export const getAllTerritory = async (req, res) => {
  try {
    await connectDB();

    const { franchiseeId, platform } = req.query;
    const filter = {};

    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    const territory = await Territory.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ territory });
  } catch (error) {
    console.error("Error fetching territory:", error);
    res.status(500).json({ message: "Failed to fetch territory" });
  }
};

// ✅ GET Single Territory by ID
export const getTerritoryById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const territory = await Territory.findById(id);
    if (!territory) return res.status(404).json({ message: "Territory not found" });

    res.status(200).json({ territory });
  } catch (error) {
    console.error("Get Territory error:", error);
    res.status(500).json({ message: "Failed to fetch Territory" });
  }
};

// ✅ POST Create New Territory
export const createTerritory = async (req, res) => {
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
    const count = await Territory.countDocuments({ stateCode, cityCode });

    const bpc = generateLocationPartnerCode({
      role: "territory",
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
    const existing = await Territory.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Territory with this email already exists" });
    }

    const { valid, missing } = validateTerritoryPayload(req.body);
    if (!valid) {
      return res.status(400).json({
        message: `Missing or invalid fields: ${missing.join(", ")}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const territory = new Territory({
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

    await territory.save();

    res.status(201).json({ message: "Territory created successfully", territory });
  } catch (error) {
    console.error("Create Territory error:", error);
    res.status(500).json({ message: "Failed to create Territory" });
  }
};

// ✅ PUT Update Territory Info
export const updateTerritory = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const updatedTerritory = await Territory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTerritory) {
      return res.status(404).json({ message: "Territory not found" });
    }

    res.status(200).json({ message: "Territory updated", territory: updatedTerritory });
  } catch (error) {
    console.error("Update Territory error:", error);
    res.status(500).json({ message: "Failed to update Territory" });
  }
};

// ✅ DELETE (Deactivate or Remove)
export const deleteTerritory = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const deleted = await Territory.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Territory not found" });
    }

    res.status(200).json({ message: "Territory deactivated", territory: deleted });
  } catch (error) {
    console.error("Delete Territory error:", error);
    res.status(500).json({ message: "Failed to deactivate Territory" });
  }
};
