import Cbv from "../../models/Cbv/Cbv.js";
import bcrypt from "bcryptjs";
import { getBBSliveDb } from "../../lib/db.js";
import { validateCbvPayload } from "../../utils/validateCbv.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

export const getAllCbv = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection("customervendors"); // BBSlive collection name (change if yours differs)

    const { franchiseeId, platform, q } = req.query;
    const filter = {};
    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }

    const docs = await col.find(filter).sort({ created_at: -1 }).limit(1000).toArray();

    const g = (o, p, d = "—") => {
      try { return p.split(".").reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o) ?? d; }
      catch { return d; }
    };

    // normalize BBSlive fields to flat UI keys
    const cbv = docs.map((d) => {
      const name =
        d.name ||
        [d.firstName, d.lastName].filter(Boolean).join(" ").trim() ||
        [d.vendor_fname, d.vendor_lname].filter(Boolean).join(" ").trim() ||
        "—";

      return {
        _id: String(d._id || ""),
        name,
        email: d.email || "—",
        phone: d.phone || d.whatsappNumber || "—",
        bpc: d.businessPartnerCode || d.bpc || "—",
        pan: d.pan || d.pan_number || "—",
        gstin: d.gstin || d.gst_number || "—",
        platform: d.platform || "BBSCART",
        status: d.accountStatus || (d.is_active ? "active" : "pending"),
        district: d.district || g(d, "address.district") || g(d, "gst_address.district"),
        state:
          d.state ||
          g(d, "address.state") ||
          g(d, "register_business_address.state"),
        city:
          d.city ||
          g(d, "address.city") ||
          g(d, "register_business_address.city"),
        pincode:
          d.pincode ||
          g(d, "address.postalCode") ||
          g(d, "register_business_address.postalCode"),
        createdAt: d.created_at || d.createdAt || null,
      };
    });

    return res.status(200).json({ cbv });
  } catch (error) {
    console.error("Error fetching cbv (BBSlive):", error);
    return res.status(500).json({ message: "Failed to fetch cbv" });
  }
};


// ✅ GET Single Cbv by ID
// READ from BBSlive instead of CRM — single CBV
export const getCbvById = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection("customervendors"); // BBSlive collection name (change if yours differs)
    const { id } = req.query;

    const { ObjectId } = await import("mongodb");
    const q = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { cbvId: id };
    const d = await col.findOne(q);
    if (!d) return res.status(404).json({ message: "Cbv not found" });

    const g = (o, p, dft = "—") => {
      try { return p.split(".").reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o) ?? dft; }
      catch { return dft; }
    };

    const cbv = {
      _id: String(d._id || ""),
      name: d.name || [d.firstName, d.lastName].filter(Boolean).join(" ").trim() || "—",
      email: d.email || "—",
      phone: d.phone || d.whatsappNumber || "—",
      bpc: d.businessPartnerCode || d.bpc || "—",
      pan: d.pan || d.pan_number || "—",
      gstin: d.gstin || d.gst_number || "—",
      platform: d.platform || "BBSCART",
      status: d.accountStatus || (d.is_active ? "active" : "pending"),
      district: d.district || g(d, "address.district"),
      state: d.state || g(d, "address.state"),
      city: d.city || g(d, "address.city"),
      pincode: d.pincode || g(d, "address.postalCode"),
      createdAt: d.created_at || d.createdAt || null,
      // relations (useful for detail screens)
      agentId: d.agentId,
      franchiseId: d.franchiseId,
      territoryId: d.territoryId,
      vendorId: d.vendorId,
    };

    return res.status(200).json({ cbv });
  } catch (error) {
    console.error("Get Cbv (BBSlive) error:", error);
    return res.status(500).json({ message: "Failed to fetch Cbv" });
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
