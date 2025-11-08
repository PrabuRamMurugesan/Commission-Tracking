// import Territory from "../../models/Territory/TerritoryHead.js";
// import bcrypt from "bcryptjs";
// import { getBBSLiveDb } from "../../lib/db.js";
// import { validateTerritoryPayload } from "../../utils/validateTerritoryHead.js";
// import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// // ✅ GET All territory (optionally by franchiseeId or platform)
// export const getAllTerritory = async (req, res) => {
//   try {
//     await getBBSLiveDb();

//     const { franchiseeId, platform } = req.query;
//     const filter = {};

//     if (franchiseeId) filter.franchiseeId = franchiseeId;
//     if (platform) filter.platform = platform;

//     const territory = await Territory.find(filter).sort({ createdAt: -1 });

//     res.status(200).json({ territory });
//   } catch (error) {
//     console.error("Error fetching territory:", error);
//     res.status(500).json({ message: "Failed to fetch territory" });
//   }
// };

// // ✅ GET Single Territory by ID
// export const getTerritoryById = async (req, res) => {
//   try {
//     await getBBSLiveDb();
//     const { id } = req.query;

//     const territory = await Territory.findById(id);
//     if (!territory) return res.status(404).json({ message: "Territory not found" });

//     res.status(200).json({ territory });
//   } catch (error) {
//     console.error("Get Territory error:", error);
//     res.status(500).json({ message: "Failed to fetch Territory" });
//   }
// };

// // ✅ POST Create New Territory
// export const createTerritory = async (req, res) => {
//   try {
//     await getBBSLiveDb();

//     const {
//       name,
//       email,
//       phone,
//       whatsappNumber,
//       password,
//       profilePic,
//       designation,
//       zone,
//       platform,
//       commissionRates,
//       franchiseeId,
//       stateCode,
//       cityCode,
//     } = req.body;
// // ✅ Generate BPC properly here
//     const count = await Territory.countDocuments({ stateCode, cityCode });

//     const bpc = generateLocationPartnerCode({
//       role: "territory",
//       stateCode,
//       cityCode,
//       createdAt: new Date(),
//       count,
//     });

//     // Basic validation
//     if (!name || !email || !password || !phone || !franchiseeId || !platform) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Check if email already exists
//     const existing = await Territory.findOne({ email });
//     if (existing) {
//       return res
//         .status(409)
//         .json({ message: "Territory with this email already exists" });
//     }

//     const { valid, missing } = validateTerritoryPayload(req.body);
//     if (!valid) {
//       return res.status(400).json({
//         message: `Missing or invalid fields: ${missing.join(", ")}`,
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const territory = new Territory({
//       name,
//       email,
//       phone,
//       whatsappNumber,
//       password: hashedPassword,
//       profilePic,
//       designation,
//       zone,
//       platform,
//       commissionRates,
//       franchiseeId,
//       businessPartnerCode: bpc,
//       stateCode,
//       cityCode,
//     });

//     await territory.save();

//     res.status(201).json({ message: "Territory created successfully", territory });
//   } catch (error) {
//     console.error("Create Territory error:", error);
//     res.status(500).json({ message: "Failed to create Territory" });
//   }
// };

// // ✅ PUT Update Territory Info
// export const updateTerritory = async (req, res) => {
//   try {
//     await getBBSLiveDb();
//     const { id } = req.query;

//     const updatedTerritory = await Territory.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     if (!updatedTerritory) {
//       return res.status(404).json({ message: "Territory not found" });
//     }

//     res.status(200).json({ message: "Territory updated", territory: updatedTerritory });
//   } catch (error) {
//     console.error("Update Territory error:", error);
//     res.status(500).json({ message: "Failed to update Territory" });
//   }
// };

// // ✅ DELETE (Deactivate or Remove)
// export const deleteTerritory = async (req, res) => {
//   try {
//     await getBBSLiveDb();
//     const { id } = req.query;

//     const deleted = await Territory.findByIdAndUpdate(
//       id,
//       { accountStatus: "inactive" },
//       { new: true }
//     );

//     if (!deleted) {
//       return res.status(404).json({ message: "Territory not found" });
//     }

//     res.status(200).json({ message: "Territory deactivated", territory: deleted });
//   } catch (error) {
//     console.error("Delete Territory error:", error);
//     res.status(500).json({ message: "Failed to deactivate Territory" });
//   }
// };


// territoryHeadController.js — BBSlive-native version (no Mongoose buffering)

// NOTE: We stop using the Mongoose Territory model for reads/writes,
// and use the BBSlive connection directly.
// Response shapes are preserved to avoid breaking the UI:
//  - getAllTerritory() returns { territory: [...] }
//  - getTerritoryById() returns { territory: { ... } }
//  - create/update/delete return the same message fields you used.

import bcrypt from "bcryptjs";
import { getBBSliveDb } from "../../lib/db.js";
import { validateTerritoryPayload } from "../../utils/validateTerritoryHead.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

const COLLECTION = "territoryheads";

// ✅ GET All territory (optionally by franchiseeId or platform)
// controllers/Territory/territoryHeadController.js
export const getAllTerritory = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection("territoryheads");

    const { franchiseeId, platform } = req.query;
    const filter = {};
    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    const docs = await col.find(filter).sort({ created_at: -1 }).limit(1000).toArray();

    const g = (o, path, d = "—") => {
      try { return path.split(".").reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o) ?? d; }
      catch { return d; }
    };

    const territory = docs.map((doc) => {
      const name =
        [doc.vendor_fname, doc.vendor_lname].filter(Boolean).join(" ").trim() ||
        doc.gst_legal_name || doc.name || "—";

      const email = doc.email || "—";
      const businessPartnerCode = doc.businessPartnerCode || doc.bpc || "—";
      const pan = doc.pan || doc.pan_number || "—";
      const gstin = doc.gstin || doc.gst_number || "—";
      const phone = doc.phone || doc.outlet_contact_no || doc.alt_mobile || "—";

      const district = doc.district || g(doc, "gst_address.district");
      const state =
        doc.state ||
        g(doc, "register_business_address.state") ||
        g(doc, "gst_address.state") ||
        g(doc, "outlet_location.state");

      const city =
        doc.city ||
        g(doc, "register_business_address.city") ||
        g(doc, "outlet_location.city");

      const pincode =
        doc.pincode ||
        g(doc, "register_business_address.postalCode") ||
        g(doc, "gst_address.postalCode") ||
        g(doc, "outlet_location.postalCode");

      const platformOut = doc.platform || doc.role || "BBSCART";
      const accountStatus =
        doc.accountStatus ||
        (doc.is_active ? "active" : doc.application_status ? String(doc.application_status) : "pending");

      const joinedDate = doc.joinedDate || doc.submitted_at || doc.created_at || doc.updated_at;

      return {
        _id: String(doc._id || ""),
        name,
        email,
        businessPartnerCode,
        pan,
        gstin,
        phone,
        platform: platformOut,
        accountStatus,
        district,
        state,
        city,
        pincode,
        totalCustomers: doc.totalCustomers || 0,
        totalTransactions: doc.totalTransactions || 0,
        commissionEarned: doc.commissionEarned || 0,
        commissionPending: doc.commissionPending || 0,
        joinedDate,
        createdAt: doc.created_at || doc.createdAt || null,
      };
    });

    return res.status(200).json({ territory });
  } catch (error) {
    console.error("Error fetching territory:", error);
    return res.status(500).json({ message: "Failed to fetch territory" });
  }
};

// ✅ GET Single Territory by ID (Mongo _id string)
export const getTerritoryById = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection(COLLECTION);
    const { id } = req.query;

    // try both _id and business ids
    const { ObjectId } = await import("mongodb");
    let doc = null;

    // _id lookup (guard against invalid ObjectId)
    if (id && ObjectId.isValid(id)) {
      doc = await col.findOne({ _id: new ObjectId(id) });
    }
    // fallback: territoryId lookup if you store a custom id
    if (!doc && id) {
      doc = await col.findOne({ territoryId: id });
    }

    if (!doc) {
      return res.status(404).json({ message: "Territory not found" });
    }

    return res.status(200).json({ territory: doc });
  } catch (error) {
    console.error("Get Territory error:", error);
    return res.status(500).json({ message: "Failed to fetch Territory" });
  }
};

// ✅ POST Create New Territory — writes to BBSlive.territoryheads
export const createTerritory = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection(COLLECTION);

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

    // Basic validation
    if (!name || !email || !password || !phone || !franchiseeId || !platform) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { valid, missing } = validateTerritoryPayload(req.body);
    if (!valid) {
      return res
        .status(400)
        .json({ message: `Missing or invalid fields: ${missing.join(", ")}` });
    }

    // Unique email check
    const existing = await col.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Territory with this email already exists" });
    }

    // Generate BPC based on location count
    const count = await col.countDocuments({ stateCode, cityCode });
    const bpc = generateLocationPartnerCode({
      role: "territory",
      stateCode,
      cityCode,
      createdAt: new Date(),
      count,
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doc = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
      accountStatus: "active",
    };

    const result = await col.insertOne(doc);
    if (!result.insertedId) {
      return res.status(500).json({ message: "Failed to create Territory" });
    }

    // keep shape
    return res
      .status(201)
      .json({ message: "Territory created successfully", territory: doc });
  } catch (error) {
    console.error("Create Territory error:", error);
    return res.status(500).json({ message: "Failed to create Territory" });
  }
};

// ✅ PUT Update Territory Info
export const updateTerritory = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection(COLLECTION);
    const { id } = req.query;

    const { ObjectId } = await import("mongodb");
    const _id =
      id && ObjectId.isValid(id) ? new ObjectId(id) : null;

    const result = await col.findOneAndUpdate(
      _id ? { _id } : { territoryId: id },
      { $set: { ...req.body, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Territory not found" });
    }

    return res
      .status(200)
      .json({ message: "Territory updated", territory: result.value });
  } catch (error) {
    console.error("Update Territory error:", error);
    return res.status(500).json({ message: "Failed to update Territory" });
  }
};

// ✅ DELETE (soft-deactivate)
export const deleteTerritory = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection(COLLECTION);
    const { id } = req.query;

    const { ObjectId } = await import("mongodb");
    const _id =
      id && ObjectId.isValid(id) ? new ObjectId(id) : null;

    const result = await col.findOneAndUpdate(
      _id ? { _id } : { territoryId: id },
      { $set: { accountStatus: "inactive", updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Territory not found" });
    }

    return res
      .status(200)
      .json({ message: "Territory deactivated", territory: result.value });
  } catch (error) {
    console.error("Delete Territory error:", error);
    return res.status(500).json({ message: "Failed to deactivate Territory" });
  }
};
