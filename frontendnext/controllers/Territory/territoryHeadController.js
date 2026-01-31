import Territory from "../../models/Territory/TerritoryHead.js";
import BBSCARTTerritoryHead from "../../models/BBSCARTTerritoryHead.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateTerritoryPayload } from "../../utils/validateTerritoryHead.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// Helper function to check if a territory has BBSCART fields
const hasBBSCARTFields = (territory) => {
  return !!(territory.vendor_fname || territory.vendor_lname || 
            territory.pan_number || territory.gst_number || 
            territory.outlet_contact_no || territory.gst_address);
};

// Helper function to transform BBSCART territory data to CRM format
const transformBBSCARTTerritory = (bbscartTerritory) => {
  const name = [bbscartTerritory.vendor_fname, bbscartTerritory.vendor_lname]
    .filter(Boolean)
    .join(" ")
    .trim() || bbscartTerritory.name || "Unknown";

  // Extract address fields from gst_address or outlet_location or register_business_address
  const gstAddr = bbscartTerritory.gst_address || {};
  const outletLoc = bbscartTerritory.outlet_location || {};
  const regAddr = bbscartTerritory.register_business_address || {};
  
  // Helper to get first non-empty value
  const getFirstNonEmpty = (...values) => {
    for (const val of values) {
      if (val && val.trim && val.trim() !== "") return val.trim();
      if (val && !val.trim && val !== "") return val;
    }
    return "";
  };

  // Generate placeholder email if missing
  const email = bbscartTerritory.email || 
                `territory-${bbscartTerritory._id}@bbscart.local`;

  // Determine account status
  let accountStatus = bbscartTerritory.accountStatus;
  if (accountStatus && (accountStatus === "active" || accountStatus === "inactive" || accountStatus === "suspended")) {
    // Use the explicit accountStatus
  } else if (bbscartTerritory.is_active === true) {
    accountStatus = "active";
  } else if (bbscartTerritory.is_decline === true) {
    accountStatus = "suspended";
  } else if (bbscartTerritory.application_status === "submitted" || 
             bbscartTerritory.application_status === "approved") {
    if (bbscartTerritory.is_active !== false) {
      accountStatus = "active";
    } else {
      accountStatus = "inactive";
    }
  } else {
    accountStatus = "inactive";
  }

  return {
    _id: bbscartTerritory._id,
    name: name,
    email: email,
    phone: bbscartTerritory.outlet_contact_no || bbscartTerritory.alt_mobile || bbscartTerritory.phone || "",
    pan: bbscartTerritory.pan_number || bbscartTerritory.pan || "",
    gstin: bbscartTerritory.gst_number || bbscartTerritory.gstin || "",
    district: getFirstNonEmpty(gstAddr.district, outletLoc.district, regAddr.district, bbscartTerritory.district),
    state: getFirstNonEmpty(gstAddr.state, outletLoc.state, regAddr.state, bbscartTerritory.state),
    city: getFirstNonEmpty(gstAddr.city, outletLoc.city, regAddr.city, bbscartTerritory.city),
    pincode: getFirstNonEmpty(gstAddr.postalCode, outletLoc.postalCode, regAddr.postalCode, bbscartTerritory.pincode),
    platform: bbscartTerritory.platform || "BBSCART",
    accountStatus: accountStatus,
    businessPartnerCode: bbscartTerritory.businessPartnerCode || "",
    totalCustomers: bbscartTerritory.totalCustomers || 0,
    totalTransactions: bbscartTerritory.totalTransactions || 0,
    commissionEarned: bbscartTerritory.commissionEarned || 0,
    commissionPending: bbscartTerritory.commissionPending || 0,
    joinedDate: bbscartTerritory.joinedDate || bbscartTerritory.created_at || bbscartTerritory.submitted_at || bbscartTerritory.createdAt || new Date(),
    createdAt: bbscartTerritory.createdAt || bbscartTerritory.created_at || new Date(),
    updatedAt: bbscartTerritory.updatedAt || bbscartTerritory.updated_at || new Date(),
    whatsappNumber: bbscartTerritory.whatsappNumber || "",
    profilePic: bbscartTerritory.profilePic || "",
    designation: bbscartTerritory.designation || "",
    zone: bbscartTerritory.zone || "",
    commissionRates: bbscartTerritory.commissionRates || [],
    loginHistory: bbscartTerritory.loginHistory || [],
    actions: bbscartTerritory.actions || { canPromote: true, canDeactivate: true },
    _source: bbscartTerritory._source || "BBSCART",
  };
};

// ✅ GET All territory (optionally by franchiseeId or platform)
export const getAllTerritory = async (req, res) => {
  try {
    await connectDB();

    const { franchiseeId, platform } = req.query;
    const filter = {};

    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    // Fetch from CRM Territory collection
    const crmTerritories = await Territory.find(filter).sort({ createdAt: -1 });

    // Fetch from BBSCART territoryheads collection (or agents with strict role filter)
    // Only if platform is BBSCART or not specified
    // NOTE: Regular agents have role "agent_head_owner" and should NOT be included
    let bbscartTerritories = [];
    if (!platform || platform === "BBSCART") {
      try {
        // First try territoryheads collection
        let bbscartData = await BBSCARTTerritoryHead.find({}).sort({ created_at: -1 });
        
        // If no results, try agents collection with STRICT role filter for territory heads only
        // NOTE: "agent_head_owner" is NOT a territory role - it's a regular agent role
        // Only include entries with explicit territory roles (territory_head, territory, territory_head_owner)
        if (bbscartData.length === 0) {
          const BBSCARTAgent = (await import("../../models/BBSCARTAgent.js")).default;
          // Fetch all agents first, then filter in memory to ensure strict filtering
          const allAgents = await BBSCARTAgent.find({}).sort({ created_at: -1 });
          
          // Strict filter: only include entries with territory-specific roles
          // EXCLUDE "agent_head_owner" and any other agent roles
          const territoryRoles = ["territory_head", "territory", "territory_head_owner"];
          bbscartData = allAgents.filter(item => {
            const role = item.role;
            // Must have a role and it must be EXACTLY one of the territory roles
            // Explicitly exclude "agent_head_owner" and any undefined/null roles
            if (!role) return false;
            return territoryRoles.includes(role) && role !== "agent_head_owner" && role !== "agent" && role !== "agent_owner";
          });
        }
        
        // Only transform if we have valid territory data
        if (bbscartData.length > 0) {
          bbscartTerritories = bbscartData.map(transformBBSCARTTerritory);
        }
      } catch (bbscartError) {
        console.warn("Error fetching BBSCART territories:", bbscartError.message);
        // If territoryheads collection doesn't exist, try agents collection with strict role filter
        try {
          const BBSCARTAgent = (await import("../../models/BBSCARTAgent.js")).default;
          // Fetch all agents first, then filter in memory to ensure strict filtering
          const allAgents = await BBSCARTAgent.find({}).sort({ created_at: -1 });
          
          // Strict filter: only include entries with territory-specific roles
          // EXCLUDE "agent_head_owner" and any other agent roles
          const territoryRoles = ["territory_head", "territory", "territory_head_owner"];
          const bbscartData = allAgents.filter(item => {
            const role = item.role;
            // Must have a role and it must be EXACTLY one of the territory roles
            if (!role) return false;
            return territoryRoles.includes(role) && role !== "agent_head_owner" && role !== "agent" && role !== "agent_owner";
          });
          
          if (bbscartData.length > 0) {
            bbscartTerritories = bbscartData.map(transformBBSCARTTerritory);
          }
        } catch (fallbackError) {
          console.warn("Error fetching BBSCART territories from agents:", fallbackError.message);
        }
      }
    }

    // Merge both collections
    const crmTerritoriesPlain = crmTerritories.map(t => {
      const territoryObj = t.toObject();
      // If CRM territory has BBSCART fields, transform it
      if (hasBBSCARTFields(territoryObj)) {
        return transformBBSCARTTerritory({
          ...territoryObj,
          _source: "CRM",
        });
      }
      return {
        ...territoryObj,
        _source: "CRM",
      };
    });

    // Combine and deduplicate by _id
    const allTerritoriesMap = new Map();
    
    // Add BBSCART territories first
    bbscartTerritories.forEach(t => {
      allTerritoriesMap.set(t._id.toString(), t);
    });
    
    // Add CRM territories (they will overwrite BBSCART if same _id)
    crmTerritoriesPlain.forEach(t => {
      allTerritoriesMap.set(t._id.toString(), t);
    });

    const allTerritories = Array.from(allTerritoriesMap.values());

    res.status(200).json({ territory: allTerritories });
  } catch (error) {
    console.error("Error fetching territory:", error);
    res.status(500).json({ message: "Failed to fetch territory" });
  }
};

// ✅ GET Single Territory by ID
export const getTerritoryById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query || req.params || {};

    // Try to find in CRM collection first
    let territory = await Territory.findById(id);

    // If not found in CRM, try BBSCART collection
    if (!territory) {
      try {
        // First try territoryheads collection
        let bbscartTerritory = await BBSCARTTerritoryHead.findOne({ _id: id });
        
        // If not found, try agents collection with role filter
        // EXCLUDE "agent_head_owner" as it's a regular agent role, not territory
        if (!bbscartTerritory) {
          const BBSCARTAgent = (await import("../../models/BBSCARTAgent.js")).default;
          bbscartTerritory = await BBSCARTAgent.findOne({ 
            _id: id,
            role: { $in: ["territory_head", "territory", "territory_head_owner"] } 
          });
        }
        
        if (bbscartTerritory) {
          // Transform BBSCART territory to CRM format for response
          territory = transformBBSCARTTerritory(bbscartTerritory.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error fetching BBSCART territory:", bbscartError.message);
      }
    } else {
      // Convert to plain object and check if it has BBSCART fields
      const territoryObj = territory.toObject();
      if (hasBBSCARTFields(territoryObj)) {
        territory = transformBBSCARTTerritory({
          ...territoryObj,
          _source: "CRM",
        });
      } else {
        territory = {
          ...territoryObj,
          _source: "CRM",
        };
      }
    }

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
    const { id } = req.query || req.params || {};

    // Try to find and update in CRM collection first
    let updatedTerritory = await Territory.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // If not found in CRM, try BBSCART collection
    if (!updatedTerritory) {
      try {
        // First try territoryheads collection
        let bbscartTerritory = await BBSCARTTerritoryHead.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        
        // If not found, try agents collection with role filter
        // EXCLUDE "agent_head_owner" as it's a regular agent role, not territory
        if (!bbscartTerritory) {
          const BBSCARTAgent = (await import("../../models/BBSCARTAgent.js")).default;
          bbscartTerritory = await BBSCARTAgent.findOneAndUpdate(
            { 
              _id: id,
              role: { $in: ["territory_head", "territory", "territory_head_owner"] } 
            },
            req.body,
            { new: true }
          );
        }
        
        if (bbscartTerritory) {
          // Transform BBSCART territory to CRM format for response
          updatedTerritory = transformBBSCARTTerritory(bbscartTerritory.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error updating BBSCART territory:", bbscartError.message);
      }
    }

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
    const { id } = req.query || req.params || {};

    // Try to find and deactivate in CRM collection first
    let deleted = await Territory.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    // If not found in CRM, try BBSCART collection
    if (!deleted) {
      try {
        // First try territoryheads collection
        let bbscartTerritory = await BBSCARTTerritoryHead.findByIdAndUpdate(
          id,
          { is_active: false, accountStatus: "inactive" },
          { new: true }
        );
        
        // If not found, try agents collection with role filter
        // EXCLUDE "agent_head_owner" as it's a regular agent role, not territory
        if (!bbscartTerritory) {
          const BBSCARTAgent = (await import("../../models/BBSCARTAgent.js")).default;
          bbscartTerritory = await BBSCARTAgent.findOneAndUpdate(
            { 
              _id: id,
              role: { $in: ["territory_head", "territory", "territory_head_owner"] } 
            },
            { is_active: false, accountStatus: "inactive" },
            { new: true }
          );
        }
        
        if (bbscartTerritory) {
          // Transform BBSCART territory to CRM format for response
          deleted = transformBBSCARTTerritory(bbscartTerritory.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error deactivating BBSCART territory:", bbscartError.message);
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: "Territory not found" });
    }

    // Ensure the response includes the updated accountStatus
    const responseData = {
      ...deleted,
      accountStatus: deleted.accountStatus || "inactive",
    };

    res.status(200).json({ message: "Territory deactivated successfully", territory: responseData });
  } catch (error) {
    console.error("Delete Territory error:", error);
    res.status(500).json({ message: "Failed to deactivate Territory" });
  }
};
