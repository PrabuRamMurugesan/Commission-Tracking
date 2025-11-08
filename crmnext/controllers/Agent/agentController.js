import Agent from "../../models/Agent/Agent.js";
import bcrypt from "bcryptjs";
import { getBBSliveDb } from "../../lib/db.js";
import { validateAgentPayload } from "../../utils/validateAgent.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";


const AGENTS_COLLECTION = "agents";

// GET All Agents from BBSlive (optionally filter by franchiseeId or platform)
export const getAllAgents = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection(AGENTS_COLLECTION);

    const { franchiseeId, platform } = req.query;
    const filter = {};
    if (franchiseeId) filter.franchiseeId = franchiseeId;
    if (platform) filter.platform = platform;

    // read raw docs from BBSlive
    const docs = await col.find(filter).sort({ created_at: -1 }).toArray();

    // map BBSlive fields to UI-friendly keys
    const agents = docs.map(d => ({
      _id: d._id,
      name: [d.vendor_fname, d.vendor_lname].filter(Boolean).join(" ").trim() || null,
      email: d.email || d.outlet_email || null,
      phone: d.outlet_contact_no || d.phone || null,
      bpc: d.businessPartnerCode || d.bpc || null,
      pan: d.pan_number || null,
      gstin: d.gst_number || null,
      platform: "BBSCART",
      status: d.is_active ? "active" : "pending",
      state: d.register_business_address?.state || d.outlet_location?.state || "",
      district: d.gst_address?.district || "",
      city: d.register_business_address?.city || d.outlet_location?.city || "",
      pincode: d.register_business_address?.postalCode || d.outlet_location?.postalCode || "",
      createdAt: d.created_at || null
    }));

    return res.status(200).json({ agents });
  } catch (error) {
    console.error("Error fetching agents from BBSlive:", error);
    return res.status(500).json({ message: "Failed to fetch agents" });
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

    const updatedAgent = await Agent.findByIdAndUpdate(id, req.body, {
      new: true,
    });

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

    const deleted = await Agent.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(200).json({ message: "Agent deactivated", agent: deleted });
  } catch (error) {
    console.error("Delete agent error:", error);
    res.status(500).json({ message: "Failed to deactivate agent" });
  }
};
