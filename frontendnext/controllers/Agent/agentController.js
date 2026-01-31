import Agent from "../../models/Agent/Agent.js";
import BBSCARTAgent from "../../models/BBSCARTAgent.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateAgentPayload } from "../../utils/validateAgent.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";

// Helper function to check if an agent has BBSCART fields
const hasBBSCARTFields = (agent) => {
  return !!(agent.vendor_fname || agent.vendor_lname || 
            agent.pan_number || agent.gst_number || 
            agent.outlet_contact_no || agent.gst_address);
};

// Helper function to transform BBSCART agent data to CRM format
const transformBBSCARTAgent = (bbscartAgent) => {
  const name = [bbscartAgent.vendor_fname, bbscartAgent.vendor_lname]
    .filter(Boolean)
    .join(" ")
    .trim() || bbscartAgent.name || "Unknown";

  // Extract address fields from gst_address or outlet_location or register_business_address
  const gstAddr = bbscartAgent.gst_address || {};
  const outletLoc = bbscartAgent.outlet_location || {};
  const regAddr = bbscartAgent.register_business_address || {};
  
  // Helper to get first non-empty value
  const getFirstNonEmpty = (...values) => {
    for (const val of values) {
      if (val && val.trim && val.trim() !== "") return val.trim();
      if (val && !val.trim && val !== "") return val;
    }
    return "";
  };

  // Generate placeholder email if missing
  const email = bbscartAgent.email || 
                `agent-${bbscartAgent._id}@bbscart.local`;

  // Determine account status
  let accountStatus = bbscartAgent.accountStatus;
  if (accountStatus && (accountStatus === "active" || accountStatus === "inactive" || accountStatus === "suspended")) {
    // Use the explicit accountStatus
  } else if (bbscartAgent.is_active === true) {
    accountStatus = "active";
  } else if (bbscartAgent.is_decline === true) {
    accountStatus = "suspended";
  } else if (bbscartAgent.application_status === "submitted" || 
             bbscartAgent.application_status === "approved") {
    if (bbscartAgent.is_active !== false) {
      accountStatus = "active";
    } else {
      accountStatus = "inactive";
    }
  } else {
    accountStatus = "inactive";
  }

  return {
    _id: bbscartAgent._id,
    name: name,
    email: email,
    phone: bbscartAgent.outlet_contact_no || bbscartAgent.alt_mobile || bbscartAgent.phone || "",
    pan: bbscartAgent.pan_number || bbscartAgent.pan || "",
    gstin: bbscartAgent.gst_number || bbscartAgent.gstin || "",
    district: getFirstNonEmpty(gstAddr.district, outletLoc.district, regAddr.district, bbscartAgent.district),
    state: getFirstNonEmpty(gstAddr.state, outletLoc.state, regAddr.state, bbscartAgent.state),
    city: getFirstNonEmpty(gstAddr.city, outletLoc.city, regAddr.city, bbscartAgent.city),
    pincode: getFirstNonEmpty(gstAddr.postalCode, outletLoc.postalCode, regAddr.postalCode, bbscartAgent.pincode),
    platform: bbscartAgent.platform || "BBSCART",
    accountStatus: accountStatus,
    businessPartnerCode: bbscartAgent.businessPartnerCode || "",
    totalCustomers: bbscartAgent.totalCustomers || 0,
    totalTransactions: bbscartAgent.totalTransactions || 0,
    commissionEarned: bbscartAgent.commissionEarned || 0,
    commissionPending: bbscartAgent.commissionPending || 0,
    joinedDate: bbscartAgent.joinedDate || bbscartAgent.created_at || bbscartAgent.submitted_at || bbscartAgent.createdAt || new Date(),
    createdAt: bbscartAgent.createdAt || bbscartAgent.created_at || new Date(),
    updatedAt: bbscartAgent.updatedAt || bbscartAgent.updated_at || new Date(),
    whatsappNumber: bbscartAgent.whatsappNumber || "",
    profilePic: bbscartAgent.profilePic || "",
    designation: bbscartAgent.designation || "",
    zone: bbscartAgent.zone || "",
    commissionRates: bbscartAgent.commissionRates || [],
    loginHistory: bbscartAgent.loginHistory || [],
    actions: bbscartAgent.actions || { canPromote: true, canDeactivate: true },
    _source: bbscartAgent._source || "BBSCART",
  };
};

// ✅ GET All Agents (optionally by franchiseeId or platform)
export const getAllAgents = async (req, res) => {
  try {
    await connectDB();

    const { franchiseeId, platform, territoryId } = req.query;
    const filter = {};

    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (territoryId) {
      // agents linked to territory head
      filter.franchiseeId = territoryId;
    } else if (franchiseeId) {
      // agents linked to franchise
      filter.franchiseeId = franchiseeId;
    }
    
    if (platform) filter.platform = platform;

    // Fetch from CRM Agent collection
    const crmAgents = await Agent.find(filter).sort({ createdAt: -1 });

    // Fetch from BBSCART agents collection (only if platform is BBSCART or not specified)
    let bbscartAgents = [];
    if (!platform || platform === "BBSCART") {
      try {
        const bbscartData = await BBSCARTAgent.find({}).sort({ created_at: -1 });
        bbscartAgents = bbscartData.map(transformBBSCARTAgent);
      } catch (bbscartError) {
        console.warn("Error fetching BBSCART agents:", bbscartError.message);
      }
    }

    // Merge both collections
    const crmAgentsPlain = crmAgents.map(a => {
      const agentObj = a.toObject();
      // If CRM agent has BBSCART fields, transform it
      if (hasBBSCARTFields(agentObj)) {
        return transformBBSCARTAgent({
          ...agentObj,
          _source: "CRM",
        });
      }
      return {
        ...agentObj,
        _source: "CRM",
      };
    });

    // Combine and deduplicate by _id
    const allAgentsMap = new Map();
    
    // Add BBSCART agents first
    bbscartAgents.forEach(a => {
      allAgentsMap.set(a._id.toString(), a);
    });
    
    // Add CRM agents (they will overwrite BBSCART if same _id)
    crmAgentsPlain.forEach(a => {
      allAgentsMap.set(a._id.toString(), a);
    });

    const allAgents = Array.from(allAgentsMap.values());

    res.status(200).json({ agents: allAgents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Failed to fetch agents" });
  }
};

// ✅ GET Single Agent by ID
export const getAgentById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const agent = await Agent.findById(id);
    if (!agent) return res.status(404).json({ message: "Agent not found" });

    res.status(200).json({ agent });
  } catch (error) {
    console.error("Get agent error:", error);
    res.status(500).json({ message: "Failed to fetch agent" });
  }
};

// ✅ POST Create New Agent
export const createAgent = async (req, res) => {
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
    const count = await Agent.countDocuments({ stateCode, cityCode });

    const bpc = generateLocationPartnerCode({
      role: "agent",
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
    const existing = await Agent.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Agent with this email already exists" });
    }

    const { valid, missing } = validateAgentPayload(req.body);
    if (!valid) {
      return res.status(400).json({
        message: `Missing or invalid fields: ${missing.join(", ")}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = new Agent({
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

    await agent.save();

    res.status(201).json({ message: "Agent created successfully", agent });
  } catch (error) {
    console.error("Create agent error:", error);
    res.status(500).json({ message: "Failed to create agent" });
  }
};

// ✅ PUT Update Agent Info
export const updateAgent = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    // Try to find and update in CRM collection first
    let updatedAgent = await Agent.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    // If not found in CRM, try BBSCART collection
    if (!updatedAgent) {
      try {
        const bbscartAgent = await BBSCARTAgent.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        if (bbscartAgent) {
          // Transform BBSCART agent to CRM format for response
          updatedAgent = transformBBSCARTAgent(bbscartAgent.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error updating BBSCART agent:", bbscartError.message);
      }
    }

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json({ message: "Agent updated", agent: updatedAgent });
  } catch (error) {
    console.error("Update agent error:", error);
    res.status(500).json({ message: "Failed to update agent" });
  }
};

// ✅ DELETE (Deactivate or Remove)
export const deleteAgent = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    // Try to find and deactivate in CRM collection first
    let deleted = await Agent.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    // If not found in CRM, try BBSCART collection
    if (!deleted) {
      try {
        const bbscartAgent = await BBSCARTAgent.findByIdAndUpdate(
          id,
          { is_active: false, accountStatus: "inactive" },
          { new: true }
        );
        if (bbscartAgent) {
          // Transform BBSCART agent to CRM format for response
          deleted = transformBBSCARTAgent(bbscartAgent.toObject());
        }
      } catch (bbscartError) {
        console.warn("Error deactivating BBSCART agent:", bbscartError.message);
      }
    }

    if (!deleted) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Ensure the response includes the updated accountStatus
    const responseData = {
      ...deleted,
      accountStatus: deleted.accountStatus || "inactive",
    };

    res.status(200).json({ message: "Agent deactivated successfully", agent: responseData });
  } catch (error) {
    console.error("Delete agent error:", error);
    res.status(500).json({ message: "Failed to deactivate agent" });
  }
};
