import Agent from "../../models/Agent/Agent.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateAgentPayload } from "../../utils/validateAgent.js";
import { generateLocationPartnerCode } from "../../utils/generatePartnerCode.js";


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

    const agents = await Agent.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ agents });
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
