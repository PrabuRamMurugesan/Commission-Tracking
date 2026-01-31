import Vendor from "../../models/Vendor/Vendor.js";
import BBSCARTVendor from "../../models/BBSCARTVendor.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateVendorPayload } from "../../utils/validateVendor.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// Helper function to check if a vendor has BBSCART fields
const hasBBSCARTFields = (vendor) => {
  return !!(vendor.vendor_fname || vendor.vendor_lname || 
            vendor.pan_number || vendor.gst_number || 
            vendor.outlet_contact_no || vendor.gst_address);
};

// Helper function to transform BBSCART vendor data to CRM format
const transformBBSCARTVendor = (bbscartVendor) => {
  const name = [bbscartVendor.vendor_fname, bbscartVendor.vendor_lname]
    .filter(Boolean)
    .join(" ")
    .trim() || bbscartVendor.name || "Unknown";

  // Extract address fields from gst_address or outlet_location or register_business_address
  const gstAddr = bbscartVendor.gst_address || {};
  const outletLoc = bbscartVendor.outlet_location || {};
  const regAddr = bbscartVendor.register_business_address || {};
  
  // Helper to get first non-empty value
  const getFirstNonEmpty = (...values) => {
    for (const val of values) {
      if (val && val.trim && val.trim() !== "") return val.trim();
      if (val && !val.trim && val !== "") return val;
    }
    return "";
  };

  // Generate placeholder email if missing
  const email = bbscartVendor.email || 
                `vendor-${bbscartVendor._id}@bbscart.local`;

  // Determine account status
  let accountStatus = bbscartVendor.accountStatus;
  if (accountStatus && (accountStatus === "active" || accountStatus === "inactive" || accountStatus === "suspended")) {
    // Use the explicit accountStatus
  } else if (bbscartVendor.is_active === true) {
    accountStatus = "active";
  } else if (bbscartVendor.is_decline === true) {
    accountStatus = "suspended";
  } else if (bbscartVendor.application_status === "submitted" || 
             bbscartVendor.application_status === "approved") {
    if (bbscartVendor.is_active !== false) {
      accountStatus = "active";
    } else {
      accountStatus = "inactive";
    }
  } else {
    accountStatus = "inactive";
  }

  return {
    _id: bbscartVendor._id,
    name: name,
    email: email,
    phone: bbscartVendor.outlet_contact_no || bbscartVendor.alt_mobile || bbscartVendor.phone || "",
    pan: bbscartVendor.pan_number || bbscartVendor.pan || "",
    gstin: bbscartVendor.gst_number || bbscartVendor.gstin || "",
    district: getFirstNonEmpty(gstAddr.district, outletLoc.district, regAddr.district, bbscartVendor.district),
    state: getFirstNonEmpty(gstAddr.state, outletLoc.state, regAddr.state, bbscartVendor.state),
    city: getFirstNonEmpty(gstAddr.city, outletLoc.city, regAddr.city, bbscartVendor.city),
    pincode: getFirstNonEmpty(gstAddr.postalCode, outletLoc.postalCode, regAddr.postalCode, bbscartVendor.pincode),
    platform: bbscartVendor.platform || "BBSCART",
    accountStatus: accountStatus,
    businessPartnerCode: bbscartVendor.businessPartnerCode || "",
    totalCustomers: bbscartVendor.totalCustomers || 0,
    totalTransactions: bbscartVendor.totalTransactions || 0,
    commissionEarned: bbscartVendor.commissionEarned || 0,
    commissionPending: bbscartVendor.commissionPending || 0,
    joinedDate: bbscartVendor.joinedDate || bbscartVendor.created_at || bbscartVendor.submitted_at || bbscartVendor.createdAt || new Date(),
    createdAt: bbscartVendor.createdAt || bbscartVendor.created_at || new Date(),
    updatedAt: bbscartVendor.updatedAt || bbscartVendor.updated_at || new Date(),
    whatsappNumber: bbscartVendor.whatsappNumber || "",
    profilePic: bbscartVendor.profilePic || "",
    designation: bbscartVendor.designation || "",
    zone: bbscartVendor.zone || "",
    commissionRates: bbscartVendor.commissionRates || [],
    loginHistory: bbscartVendor.loginHistory || [],
    actions: bbscartVendor.actions || { canPromote: true, canDeactivate: true },
    _source: bbscartVendor._source || "BBSCART",
  };
};

// ✅ GET All vendor (role-aware via query: franchiseeId / territoryId / agentId / platform)
// ✅ GET All vendor (optionally by franchiseeId, platform, or single vendor for vendor dashboard)
export const getAllVendor = async (req, res) => {
  try {
    await connectDB();

    const { franchiseeId, platform, role, userId, vendorId } = req.query;
    const filter = {};

    // For admin / franchise views
    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    // Direct vendorId filter (if passed explicitly)
    if (vendorId) {
      filter._id = vendorId;
    }

    // Vendor dashboard case:
    // if role=vendor and userId is sent, restrict to that vendor only
    if (!vendorId && role === "vendor" && userId) {
      filter._id = userId;
    }

    // Fetch from CRM Vendor collection
    const crmVendors = await Vendor.find(filter).sort({ createdAt: -1 });

    // Fetch from BBSCART vendors collection (only if platform is BBSCART or not specified)
    let bbscartVendors = [];
    if (!platform || platform === "BBSCART") {
      try {
        const bbscartData = await BBSCARTVendor.find({}).sort({ created_at: -1 });
        bbscartVendors = bbscartData.map(transformBBSCARTVendor);
      } catch (bbscartError) {
        console.warn("Error fetching BBSCART vendors:", bbscartError.message);
      }
    }

    // Merge both collections
    const crmVendorsPlain = crmVendors.map(v => {
      const vendorObj = v.toObject();
      // If CRM vendor has BBSCART fields, transform it
      if (hasBBSCARTFields(vendorObj)) {
        return transformBBSCARTVendor({
          ...vendorObj,
          _source: "CRM",
        });
      }
      return {
        ...vendorObj,
        _source: "CRM",
      };
    });

    // Combine and deduplicate by _id
    const allVendorsMap = new Map();
    
    // Add BBSCART vendors first
    bbscartVendors.forEach(v => {
      allVendorsMap.set(v._id.toString(), v);
    });
    
    // Add CRM vendors (they will overwrite BBSCART if same _id)
    crmVendorsPlain.forEach(v => {
      allVendorsMap.set(v._id.toString(), v);
    });

    const allVendors = Array.from(allVendorsMap.values());

    res.status(200).json({ vendor: allVendors });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch vendor" });
  }
};

// ✅ GET Single Vendor by ID
export const getVendorById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.status(200).json({ vendor });
  } catch (error) {
    console.error("Get Vendor error:", error);
    res.status(500).json({ message: "Failed to fetch Vendor" });
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

    // Try to find and update in CRM collection first
    let updatedVendor = await Vendor.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // If not found in CRM, try BBSCART collection
    if (!updatedVendor) {
      try {
        const bbscartVendor = await BBSCARTVendor.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        if (bbscartVendor) {
          // Transform BBSCART vendor to CRM format for response
          updatedVendor = transformBBSCARTVendor(bbscartVendor.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error updating BBSCART vendor:", bbscartError.message);
      }
    }

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

    // Try to find and deactivate in CRM collection first
    let deleted = await Vendor.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    // If not found in CRM, try BBSCART collection
    if (!deleted) {
      try {
        const bbscartVendor = await BBSCARTVendor.findByIdAndUpdate(
          id,
          { is_active: false, accountStatus: "inactive" },
          { new: true }
        );
        if (bbscartVendor) {
          // Transform BBSCART vendor to CRM format for response
          deleted = transformBBSCARTVendor(bbscartVendor.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error deactivating BBSCART vendor:", bbscartError.message);
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Ensure the response includes the updated accountStatus
    const responseData = {
      ...deleted,
      accountStatus: deleted.accountStatus || "inactive",
    };

    res.status(200).json({ message: "Vendor deactivated successfully", vendor: responseData });
  } catch (error) {
    console.error("Delete Vendor error:", error);
    res.status(500).json({ message: "Failed to deactivate Vendor" });
  }
};
