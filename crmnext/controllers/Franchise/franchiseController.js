import Francise from "../../models/Franchise/Francise.js";
import BBSCARTFranchiseHead from "../../models/BBSCARTFranchiseHead.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateFrancisePayload } from "../../utils/validateFranchise.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// Helper function to check if a franchise has BBSCART fields
const hasBBSCARTFields = (franchise) => {
  return !!(franchise.vendor_fname || franchise.vendor_lname || 
            franchise.pan_number || franchise.gst_number || 
            franchise.outlet_contact_no || franchise.gst_address);
};

// Helper function to transform BBSCART franchise data to CRM format
const transformBBSCARTFranchise = (bbscartFranchise) => {
  const name = [bbscartFranchise.vendor_fname, bbscartFranchise.vendor_lname]
    .filter(Boolean)
    .join(" ")
    .trim() || bbscartFranchise.name || "Unknown";

  // Extract address fields from gst_address or outlet_location or register_business_address
  // Prefer non-empty values across all sources
  const gstAddr = bbscartFranchise.gst_address || {};
  const outletLoc = bbscartFranchise.outlet_location || {};
  const regAddr = bbscartFranchise.register_business_address || {};
  
  // Helper to get first non-empty value
  const getFirstNonEmpty = (...values) => {
    for (const val of values) {
      if (val && val.trim && val.trim() !== "") return val.trim();
      if (val && !val.trim && val !== "") return val;
    }
    return "";
  };

  // Generate placeholder email if missing (using franchise ID)
  const email = bbscartFranchise.email || 
                `franchise-${bbscartFranchise._id}@bbscart.local`;

  // Determine account status - prioritize existing accountStatus, then check BBSCART fields
  let accountStatus = bbscartFranchise.accountStatus;
  
  // If accountStatus is explicitly set, use it (for updates)
  if (accountStatus && (accountStatus === "active" || accountStatus === "inactive" || accountStatus === "suspended")) {
    // Use the explicit accountStatus
  } else if (bbscartFranchise.is_active === true) {
    accountStatus = "active";
  } else if (bbscartFranchise.is_decline === true) {
    accountStatus = "suspended";
  } else if (bbscartFranchise.application_status === "submitted" || 
             bbscartFranchise.application_status === "approved") {
    // Only set to active if is_active is also true or not explicitly false
    if (bbscartFranchise.is_active !== false) {
      accountStatus = "active";
    } else {
      accountStatus = "inactive";
    }
  } else {
    accountStatus = "inactive";
  }

  return {
    _id: bbscartFranchise._id,
    name: name,
    email: email,
    phone: bbscartFranchise.outlet_contact_no || bbscartFranchise.alt_mobile || bbscartFranchise.phone || "",
    pan: bbscartFranchise.pan_number || bbscartFranchise.pan || "",
    gstin: bbscartFranchise.gst_number || bbscartFranchise.gstin || "",
    district: getFirstNonEmpty(gstAddr.district, outletLoc.district, regAddr.district, bbscartFranchise.district),
    state: getFirstNonEmpty(gstAddr.state, outletLoc.state, regAddr.state, bbscartFranchise.state),
    city: getFirstNonEmpty(gstAddr.city, outletLoc.city, regAddr.city, bbscartFranchise.city),
    pincode: getFirstNonEmpty(gstAddr.postalCode, outletLoc.postalCode, regAddr.postalCode, bbscartFranchise.pincode),
    platform: bbscartFranchise.platform || "BBSCART",
    accountStatus: accountStatus,
    businessPartnerCode: bbscartFranchise.businessPartnerCode || "",
    totalCustomers: bbscartFranchise.totalCustomers || 0,
    totalTransactions: bbscartFranchise.totalTransactions || 0,
    commissionEarned: bbscartFranchise.commissionEarned || 0,
    commissionPending: bbscartFranchise.commissionPending || 0,
    joinedDate: bbscartFranchise.joinedDate || bbscartFranchise.created_at || bbscartFranchise.submitted_at || bbscartFranchise.createdAt || new Date(),
    createdAt: bbscartFranchise.createdAt || bbscartFranchise.created_at || new Date(),
    updatedAt: bbscartFranchise.updatedAt || bbscartFranchise.updated_at || new Date(),
    // Preserve other fields
    whatsappNumber: bbscartFranchise.whatsappNumber || "",
    profilePic: bbscartFranchise.profilePic || "",
    designation: bbscartFranchise.designation || "",
    zone: bbscartFranchise.zone || "",
    commissionRates: bbscartFranchise.commissionRates || [],
    loginHistory: bbscartFranchise.loginHistory || [],
    actions: bbscartFranchise.actions || { canPromote: true, canDeactivate: true },
    // Mark source
    _source: bbscartFranchise._source || "BBSCART",
  };
};

// ✅ GET All Francises (optionally by franchiseeId or platform)
export const getAllFranchises = async (req, res) => {
  try {
    await connectDB();

    const { franchiseeId, platform } = req.query;
    const filter = {};

    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    // Fetch from CRM Franchise collection
    const crmFranchises = await Francise.find(filter).sort({ createdAt: -1 });

    // Fetch from BBSCART franchiseheads collection (only if platform is BBSCART or not specified)
    let bbscartFranchises = [];
    if (!platform || platform === "BBSCART") {
      try {
        const bbscartData = await BBSCARTFranchiseHead.find({}).sort({ created_at: -1 });
        bbscartFranchises = bbscartData.map(transformBBSCARTFranchise);
      } catch (bbscartError) {
        console.warn("Error fetching BBSCART franchises:", bbscartError.message);
        // Continue even if BBSCART fetch fails
      }
    }

    // Merge both collections, prioritizing CRM franchises (they have email uniqueness)
    // Convert CRM franchises to plain objects for consistency
    // Transform CRM franchises that have BBSCART fields
    const crmFranchisesPlain = crmFranchises.map(f => {
      const franchiseObj = f.toObject();
      // If CRM franchise has BBSCART fields, transform it
      if (hasBBSCARTFields(franchiseObj)) {
        return transformBBSCARTFranchise({
          ...franchiseObj,
          _source: "CRM",
        });
      }
      // Otherwise, return as-is with source marker
      return {
        ...franchiseObj,
        _source: "CRM",
      };
    });

    // Combine and deduplicate by _id (in case a franchise exists in both)
    const allFranchisesMap = new Map();
    
    // Add BBSCART franchises first
    bbscartFranchises.forEach(f => {
      allFranchisesMap.set(f._id.toString(), f);
    });
    
    // Add CRM franchises (they will overwrite BBSCART if same _id)
    crmFranchisesPlain.forEach(f => {
      allFranchisesMap.set(f._id.toString(), f);
    });

    const allFranchises = Array.from(allFranchisesMap.values());

    res.status(200).json({ francise: allFranchises });
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
const formatted = francise.map(f => ({
    _id: f._id,
    name: `${f.vendor_fname || ""} ${f.vendor_lname || ""}`.trim(),
    email: f.email || "",
    phone: f.outlet_contact_no || "",
    pan: f.pan_number || "",
    gstin: f.gst_number || "",
    district: f.gst_address?.district || "",
    state: f.gst_address?.state || "",
    city: f.gst_address?.city || "",
    pincode: f.register_business_address?.postalCode || "",
    platform: "BBSCART",
    accountStatus: f.accountStatus || "active",
    totalCustomers: f.totalCustomers || 0,
    totalTransactions: f.totalTransactions || 0,
    commissionEarned: f.commissionEarned || 0,
    commissionPending: f.commissionPending || 0,
    joinedDate: f.joinedDate,
    whatsappNumber: f.whatsappNumber || "",
    profilePic: f.profilePic || "",
    designation: "Francise",
    zone: f.zone || "",
    commissionRates: f.commissionRates || [],
    loginHistory: f.loginHistory || [],
    actions: {
        canPromote: true,
        canDeactivate: true
    }
}));

    const francise = await Francise.findById(id);
    if (!francise)
      return res.status(404).json({ message: "Francise not found" });

    res.status(200).json({ francise: formatted });
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

    // Try to find and update in CRM collection first
    let updatedFrancise = await Francise.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // If not found in CRM, try BBSCART collection
    if (!updatedFrancise) {
      try {
        const bbscartFranchise = await BBSCARTFranchiseHead.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        if (bbscartFranchise) {
          // Transform BBSCART franchise to CRM format for response
          updatedFrancise = transformBBSCARTFranchise(bbscartFranchise.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error updating BBSCART franchise:", bbscartError.message);
      }
    }

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

    // Try to find and deactivate in CRM collection first
    let deleted = await Francise.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    // If not found in CRM, try BBSCART collection
    if (!deleted) {
      try {
        const bbscartFranchise = await BBSCARTFranchiseHead.findByIdAndUpdate(
          id,
          { is_active: false, accountStatus: "inactive" },
          { new: true }
        );
        if (bbscartFranchise) {
          // Transform BBSCART franchise to CRM format for response
          deleted = transformBBSCARTFranchise(bbscartFranchise.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error deactivating BBSCART franchise:", bbscartError.message);
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: "Francise not found" });
    }

    // Ensure the response includes the updated accountStatus
    const responseData = {
      ...deleted,
      accountStatus: deleted.accountStatus || "inactive",
    };

    res
      .status(200)
      .json({ message: "Franchise deactivated successfully", francise: responseData });
  } catch (error) {
    console.error("Delete francise error:", error);
    res.status(500).json({ message: "Failed to deactivate franchise" });
  }
};
