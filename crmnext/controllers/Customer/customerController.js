import Customer from "../../models/Customer/Customer.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateCustomerPayload } from "../../utils/validateCustomer.js";
import Agent from "../../models/Agent/Agent.js";
import Vendor from "../../models/Vendor.js";
import Cbv from "../../models/Cbv/Cbv.js";
import Franchise from "../../models/Franchise/Franchise.js";
import Territory from "../../models/Territory/TerritoryHead.js";

export const getAllCustomers = async (req, res) => {
  try {
    await connectDB();

    const { platform } = req.query;
    const filter = {};

    if (platform) filter.platform = platform;

    const customers = await Customer.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};
// ✅ GET Single Customer by ID
export const getCustomerById = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ customer });
  } catch (error) {
    console.error("Get customer error:", error);
    res.status(500).json({ message: "Failed to fetch customer" });
  }
};

// ✅ POST Create New Customer
export const createCustomer = async (req, res) => {
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

      referralId, // ← NEW
    } = req.body;

    // // Basic validation
    // if (!name || !email || !password || !phone || !franchiseeId || !platform) {
    //   return res.status(400).json({ message: "Missing required fields" });
    // }
    // Basic validation
    if (!name || !email || !password || !phone || !platform) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if email already exists
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Customer with this email already exists" });
    }

    const { valid, missing } = validateCustomerPayload(req.body);
    if (!valid) {
      return res.status(400).json({
        message: `Missing or invalid fields: ${missing.join(", ")}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Determine referral type
    let agentId, franchiseId, vendorId, cbvId, territoryId;
    if (referralId) {
      if (await Agent.exists({ _id: referralId })) agentId = referralId;
      else if (await Franchise.exists({ _id: referralId })) franchiseId = referralId;
      else if (await Territory.exists({ _id: referralId }))
        territoryId = referralId;
      else if (await Vendor.exists({ _id: referralId })) vendorId = referralId;
      else if (await Cbv.exists({ _id: referralId })) cbvId = referralId;
    }
    const customer = new Customer({
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
      agentId, // ← may be undefined
      franchiseId,
      territoryId,
      vendorId, // ← may be undefined
      cbvId, // ← may be undefined
      // franchiseeId,
    });

    await customer.save();

    res
      .status(201)
      .json({ message: "Customer created successfully", customer });
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ message: "Failed to create customer" });
  }
};

// ✅ PUT Update Customer Info
export const updateCustomer = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer updated", customer: updatedCustomer });
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({ message: "Failed to update customer" });
  }
};

// ✅ DELETE (Deactivate or Remove)
export const deleteCustomer = async (req, res) => {
  try {
    await connectDB();
    const { id } = req.query;

    const deleted = await Customer.findByIdAndUpdate(
      id,
      { accountStatus: "inactive" },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer deactivated", customer: deleted });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: "Failed to deactivate customer" });
  }
};
