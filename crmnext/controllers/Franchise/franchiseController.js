import Francise from "../../models/Franchise/Francise.js";
import bcrypt from "bcryptjs";
import { getBBSliveDb } from "../../lib/db.js";
import { validateFrancisePayload } from "../../utils/validateFranchise.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// ✅ GET All Francises (optionally by franchiseeId or platform)
// ✅ GET All Franchises (normalized for UI)
export const getAllFranchises = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection("franchiseheads");

    // accept both names: franchiseId (UI) and franchiseeId (older)
    const rawFranchiseId = req.query.franchiseId || req.query.franchiseeId || undefined;
    const platform = req.query.platform || undefined;

    const filter = {};
    if (rawFranchiseId) filter.franchiseeId = rawFranchiseId;
    if (platform) filter.platform = platform;

    // fetch full docs (no projection that strips fields)
    const docs = await col
      .find(filter)
      .sort({ created_at: -1, joinedDate: -1 })
      .limit(1000)
      .toArray();

    // flatten to the keys your table renders
    const francise = docs.map((doc) => {
      const g = (o, p, d = "—") => {
        try { return p.split(".").reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o) ?? d; }
        catch { return d; }
      };

      const name =
        [doc.vendor_fname, doc.vendor_lname].filter(Boolean).join(" ").trim() ||
        doc.gst_legal_name || doc.name || "—";

      const email = doc.email || "—";
      const businessPartnerCode = doc.businessPartnerCode || doc.bpc || "—";
      const pan = doc.pan || doc.pan_number || "—";
      const gstin = doc.gstin || doc.gst_number || "—";
      const phone = doc.phone || doc.outlet_contact_no || doc.alt_mobile || "—";

      const district = doc.district || g(doc, "gst_address.district", "—");
      const state =
        doc.state ||
        g(doc, "register_business_address.state", "—") ||
        g(doc, "gst_address.state", "—") ||
        g(doc, "outlet_location.state", "—");

      const city =
        doc.city ||
        g(doc, "register_business_address.city", "—") ||
        g(doc, "outlet_location.city", "—");

      const pincode =
        doc.pincode ||
        g(doc, "register_business_address.postalCode", "—") ||
        g(doc, "gst_address.postalCode", "—") ||
        g(doc, "outlet_location.postalCode", "—");

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
