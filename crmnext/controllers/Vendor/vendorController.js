import Vendor from "../../models/Vendor/Vendor.js";
import bcrypt from "bcryptjs";
import { getBBSliveDb } from "../../lib/db.js";
import { validateVendorPayload } from "../../utils/validateVendor.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

const VENDORS_COLLECTION = "vendors";

// GET: list vendors from BBSlive (optionally filter by franchiseeId or platform)
export const getAllVendor = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection(VENDORS_COLLECTION);

    const { franchiseeId, platform } = req.query;
    const filter = {};
    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    const docs = await col.find(filter).sort({ created_at: -1 }).toArray();

    const vendor = docs.map((d) => ({
      _id: String(d._id || ""),
      name: [d.vendor_fname, d.vendor_lname].filter(Boolean).join(" ").trim() || d.gst_legal_name || d.name || "—",
      email: d.email || "—",
      bpc: d.businessPartnerCode || d.bpc || "—",
      pan: d.pan_number || "—",
      gstin: d.gst_number || "—",
      phone: d.outlet_contact_no || d.phone || "—",
      platform: "BBSCART",
      status: d.is_active ? "active" : (d.application_status ? String(d.application_status) : "pending"),
      district: d.gst_address?.district || "—",
      state: d.register_business_address?.state || d.outlet_location?.state || "—",
      city: d.register_business_address?.city || d.outlet_location?.city || "—",
      pincode: d.register_business_address?.postalCode || d.outlet_location?.postalCode || "—",
      createdAt: d.created_at || d.updated_at || null,
    }));

    return res.status(200).json({ vendor });
  } catch (error) {
    console.error("Error fetching vendor (BBSlive):", error);
    return res.status(500).json({ message: "Failed to fetch vendor" });
  }
};

// GET: single vendor by id from BBSlive
export const getVendorById = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection(VENDORS_COLLECTION);
    const { id } = req.query;

    const { ObjectId } = await import("mongodb");
    const q = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { vendorId: id };
    const d = await col.findOne(q);
    if (!d) return res.status(404).json({ message: "Vendor not found" });

    const vendor = {
      _id: String(d._id || ""),
      name: [d.vendor_fname, d.vendor_lname].filter(Boolean).join(" ").trim() || d.gst_legal_name || d.name || "—",
      email: d.email || "—",
      bpc: d.businessPartnerCode || d.bpc || "—",
      pan: d.pan_number || "—",
      gstin: d.gst_number || "—",
      phone: d.outlet_contact_no || d.phone || "—",
      platform: "BBSCART",
      status: d.is_active ? "active" : (d.application_status ? String(d.application_status) : "pending"),
      district: d.gst_address?.district || "—",
      state: d.register_business_address?.state || d.outlet_location?.state || "—",
      city: d.register_business_address?.city || d.outlet_location?.city || "—",
      pincode: d.register_business_address?.postalCode || d.outlet_location?.postalCode || "—",
      createdAt: d.created_at || d.updated_at || null,
    };

    return res.status(200).json({ vendor });
  } catch (error) {
    console.error("Get Vendor (BBSlive) error:", error);
    return res.status(500).json({ message: "Failed to fetch Vendor" });
  }
};


// ✅ POST Create New Vendor
export const createVendor = async (req, res) => {
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
    const count = await Vendor.countDocuments({ stateCode, cityCode });

    const bpc = generateLocationPartnerCode({
      role: "vendor",
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
    const existing = await Vendor.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Vendor with this email already exists" });
    }

    const { valid, missing } = validateVendorPayload(req.body);
    if (!valid) {
      return res.status(400).json({
        message: `Missing or invalid fields: ${missing.join(", ")}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = new Vendor({
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

    await vendor.save();

    res.status(201).json({ message: "Vendor created successfully", vendor });
  } catch (error) {
    console.error("Create Vendor error:", error);
    res.status(500).json({ message: "Failed to create Vendor" });
  }
};

// ✅ PUT Update Vendor Info
export const updateVendor = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const updatedVendor = await Vendor.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ message: "Vendor updated", vendor: updatedVendor });
  } catch (error) {
    console.error("Update Vendor error:", error);
    res.status(500).json({ message: "Failed to update Vendor" });
  }
};

// ✅ DELETE (Deactivate or Remove)
export const deleteVendor = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const deleted = await Vendor.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ message: "Vendor deactivated", vendor: deleted });
  } catch (error) {
    console.error("Delete Vendor error:", error);
    res.status(500).json({ message: "Failed to deactivate Vendor" });
  }
};
