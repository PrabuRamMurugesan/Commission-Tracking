import Cbv from "../../models/Cbv/Cbv.js";
import BBSCARTCBV from "../../models/BBSCARTCBV.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateCbvPayload } from "../../utils/validateCbv.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// Helper function to check if a CBV has BBSCART fields
const hasBBSCARTFields = (cbv) => {
  return !!(cbv.vendor_fname || cbv.vendor_lname || 
            cbv.pan_number || cbv.gst_number || 
            cbv.outlet_contact_no || cbv.gst_address);
};

// Helper function to transform BBSCART CBV data to CRM format
const transformBBSCARTCBV = (bbscartCBV) => {
  const name = [bbscartCBV.vendor_fname, bbscartCBV.vendor_lname]
    .filter(Boolean)
    .join(" ")
    .trim() || bbscartCBV.name || "Unknown";

  // Extract address fields from gst_address or outlet_location or register_business_address
  const gstAddr = bbscartCBV.gst_address || {};
  const outletLoc = bbscartCBV.outlet_location || {};
  const regAddr = bbscartCBV.register_business_address || {};
  
  // Helper to get first non-empty value
  const getFirstNonEmpty = (...values) => {
    for (const val of values) {
      if (val && val.trim && val.trim() !== "") return val.trim();
      if (val && !val.trim && val !== "") return val;
    }
    return "";
  };

  // Generate placeholder email if missing
  const email = bbscartCBV.email || 
                `cbv-${bbscartCBV._id}@bbscart.local`;

  // Determine account status
  let accountStatus = bbscartCBV.accountStatus;
  if (accountStatus && (accountStatus === "active" || accountStatus === "inactive" || accountStatus === "suspended")) {
    // Use the explicit accountStatus
  } else if (bbscartCBV.is_active === true) {
    accountStatus = "active";
  } else if (bbscartCBV.is_decline === true) {
    accountStatus = "suspended";
  } else if (bbscartCBV.application_status === "submitted" || 
             bbscartCBV.application_status === "approved") {
    if (bbscartCBV.is_active !== false) {
      accountStatus = "active";
    } else {
      accountStatus = "inactive";
    }
  } else {
    accountStatus = "inactive";
  }

  return {
    _id: bbscartCBV._id,
    name: name,
    email: email,
    phone: bbscartCBV.outlet_contact_no || bbscartCBV.outlet_phone_no || bbscartCBV.mobile || bbscartCBV.alt_mobile || bbscartCBV.phone || "",
    pan: bbscartCBV.pan_number || bbscartCBV.pan || "",
    gstin: bbscartCBV.gst_number || bbscartCBV.gstin || "",
    district: getFirstNonEmpty(gstAddr.district, outletLoc.district, regAddr.district, bbscartCBV.district),
    state: getFirstNonEmpty(gstAddr.state, outletLoc.state, regAddr.state, bbscartCBV.state),
    city: getFirstNonEmpty(gstAddr.city, outletLoc.city, regAddr.city, bbscartCBV.city),
    pincode: getFirstNonEmpty(gstAddr.postalCode, outletLoc.postalCode, regAddr.postalCode, bbscartCBV.pincode),
    platform: bbscartCBV.platform || "BBSCART",
    accountStatus: accountStatus,
    businessPartnerCode: bbscartCBV.businessPartnerCode || "",
    totalCustomers: bbscartCBV.totalCustomers || 0,
    totalTransactions: bbscartCBV.totalTransactions || 0,
    commissionEarned: bbscartCBV.commissionEarned || 0,
    commissionPending: bbscartCBV.commissionPending || 0,
    joinedDate: bbscartCBV.joinedDate || bbscartCBV.created_at || bbscartCBV.submitted_at || bbscartCBV.createdAt || new Date(),
    createdAt: bbscartCBV.createdAt || bbscartCBV.created_at || new Date(),
    updatedAt: bbscartCBV.updatedAt || bbscartCBV.updated_at || new Date(),
    whatsappNumber: bbscartCBV.whatsappNumber || "",
    profilePic: bbscartCBV.profilePic || "",
    designation: bbscartCBV.designation || "",
    zone: bbscartCBV.zone || "",
    commissionRates: bbscartCBV.commissionRates || [],
    loginHistory: bbscartCBV.loginHistory || [],
    actions: bbscartCBV.actions || { canPromote: true, canDeactivate: true },
    _source: bbscartCBV._source || "BBSCART",
  };
};

// ✅ GET All cbv (optionally by franchiseeId or platform)
export const getAllCbv = async (req, res) => {
  try {
    await connectDB();

    const { franchiseeId, platform } = req.query;
    const filter = {};

    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    // Fetch from CRM CBV collection
    const crmCBVs = await Cbv.find(filter).sort({ createdAt: -1 });

    // Fetch from BBSCART customervendors collection (only if platform is BBSCART or not specified)
    let bbscartCBVs = [];
    if (!platform || platform === "BBSCART") {
      try {
        const bbscartData = await BBSCARTCBV.find({}).sort({ created_at: -1 });
        bbscartCBVs = bbscartData.map(transformBBSCARTCBV);
      } catch (bbscartError) {
        console.warn("Error fetching BBSCART CBVs:", bbscartError.message);
      }
    }

    // Merge both collections
    const crmCBVsPlain = crmCBVs.map(c => {
      const cbvObj = c.toObject();
      // If CRM CBV has BBSCART fields, transform it
      if (hasBBSCARTFields(cbvObj)) {
        return transformBBSCARTCBV({
          ...cbvObj,
          _source: "CRM",
        });
      }
      return {
        ...cbvObj,
        _source: "CRM",
      };
    });

    // Combine and deduplicate by _id
    const allCBVsMap = new Map();
    
    // Add BBSCART CBVs first
    bbscartCBVs.forEach(c => {
      allCBVsMap.set(c._id.toString(), c);
    });
    
    // Add CRM CBVs (they will overwrite BBSCART if same _id)
    crmCBVsPlain.forEach(c => {
      allCBVsMap.set(c._id.toString(), c);
    });

    const allCBVs = Array.from(allCBVsMap.values());

    res.status(200).json({ cbv: allCBVs });
  } catch (error) {
    console.error("Error fetching cbv:", error);
    res.status(500).json({ message: "Failed to fetch cbv" });
  }
};

// ✅ GET Single Cbv by ID
export const getCbvById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query || req.params || {};

    // Try to find in CRM collection first
    let cbv = await Cbv.findById(id);

    // If not found in CRM, try BBSCART collection
    if (!cbv) {
      try {
        const bbscartCBV = await BBSCARTCBV.findById(id);
        if (bbscartCBV) {
          // Transform BBSCART CBV to CRM format for response
          cbv = transformBBSCARTCBV(bbscartCBV.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error fetching BBSCART CBV:", bbscartError.message);
      }
    } else {
      // Convert to plain object and check if it has BBSCART fields
      const cbvObj = cbv.toObject();
      if (hasBBSCARTFields(cbvObj)) {
        cbv = transformBBSCARTCBV({
          ...cbvObj,
          _source: "CRM",
        });
      } else {
        cbv = {
          ...cbvObj,
          _source: "CRM",
        };
      }
    }

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
    const { id } = req.query || req.params || {};

    // Try to find and update in CRM collection first
    let updatedCbv = await Cbv.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // If not found in CRM, try BBSCART collection
    if (!updatedCbv) {
      try {
        const bbscartCBV = await BBSCARTCBV.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        if (bbscartCBV) {
          // Transform BBSCART CBV to CRM format for response
          updatedCbv = transformBBSCARTCBV(bbscartCBV.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error updating BBSCART CBV:", bbscartError.message);
      }
    }

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
    const { id } = req.query || req.params || {};

    // Try to find and deactivate in CRM collection first
    let deleted = await Cbv.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    // If not found in CRM, try BBSCART collection
    if (!deleted) {
      try {
        const bbscartCBV = await BBSCARTCBV.findByIdAndUpdate(
          id,
          { is_active: false, accountStatus: "inactive" },
          { new: true }
        );
        if (bbscartCBV) {
          // Transform BBSCART CBV to CRM format for response
          deleted = transformBBSCARTCBV(bbscartCBV.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error deactivating BBSCART CBV:", bbscartError.message);
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: "Cbv not found" });
    }

    // Ensure the response includes the updated accountStatus
    const responseData = {
      ...deleted,
      accountStatus: deleted.accountStatus || "inactive",
    };

    res.status(200).json({ message: "Cbv deactivated successfully", cbv: responseData });
  } catch (error) {
    console.error("Delete Cbv error:", error);
    res.status(500).json({ message: "Failed to deactivate Cbv" });
  }
};
