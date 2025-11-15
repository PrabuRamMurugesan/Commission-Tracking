import Customer from "../../models/Customer/Customer.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateCustomerPayload } from "../../utils/validateCustomer.js";

import Agent from "../../models/Agent/Agent.js";
import Vendor from "../../models/Vendor.js";
import Cbv from "../../models/Cbv/Cbv.js";
import Franchise from "../../models/Franchise/Francise.js";
import Territory from "../../models/Territory/TerritoryHead.js";

import BBSCARTUser from "../../models/BBSCARTUser.js";
import mongoose from "mongoose";

// ================================
// OLD CRM CUSTOMER ENDPOINTS
// (still kept, in case you use them)
// ================================

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

// ✅ POST Create New Customer (manual entry – optional)
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
      referralId, // can be Agent / Franchise / Territory / Vendor / CBV
    } = req.body;

    if (!name || !email || !password || !phone || !platform) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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

    let agentId, franchiseId, vendorId, cbvId, territoryId;
    if (referralId) {
      if (await Agent.exists({ _id: referralId })) agentId = referralId;
      else if (await Franchise.exists({ _id: referralId }))
        franchiseId = referralId;
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
      agentId,
      franchiseId,
      territoryId,
      vendorId,
      cbvId,
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

// =====================================================
// NEW: FILTERED CUSTOMERS FROM BBSlive.users
// Hierarchy-aware: Franchise / Territory / Agent / Vendor
// =====================================================

export const getFilteredCustomersFromBBSlive = async (req, res) => {
  try {
    await connectDB();

    const { role, userId } = req.query;

    const baseMatch = {
      $or: [
        { role: "customer" },
        { role: "user" },
        { roles: "user" },
        { roles: { $in: ["user", "customer"] } },
      ],
    };

    const chainMatch = {};

    if (role === "vendor") {
      // Vendor → Customer
      chainMatch.vendor_id = new mongoose.Types.ObjectId(userId);
    } else if (role === "agent") {
      // Agent → Vendor → Customer
      const vendors = await Vendor.find({ agentId: userId }).select("_id");
      const vendorIds = vendors.map((v) => v._id);
      if (!vendorIds.length) {
        return res.status(200).json({ customers: [] });
      }
      chainMatch.vendor_id = { $in: vendorIds };
    } else if (role === "franchise") {
      // Franchise → Agent → Vendor → Customer
      const vendors = await Vendor.find({ franchiseeId: userId }).select("_id");
      const vendorIds = vendors.map((v) => v._id);
      if (!vendorIds.length) {
        return res.status(200).json({ customers: [] });
      }
      chainMatch.vendor_id = { $in: vendorIds };
    } else if (role === "territory") {
      // Territory → Agent → Vendor → Customer
      const vendors = await Vendor.find({ territoryId: userId }).select("_id");
      const vendorIds = vendors.map((v) => v._id);
      if (!vendorIds.length) {
        return res.status(200).json({ customers: [] });
      }
      chainMatch.vendor_id = { $in: vendorIds };
    } else if (role === "customer") {
      // Customer dashboard – see self only
      if (!userId) {
        return res
          .status(400)
          .json({ message: "userId is required for customer role" });
      }
      chainMatch._id = new mongoose.Types.ObjectId(userId);
    }
    // CBV, logistics, health partner etc will be filled later

    const finalMatch =
      Object.keys(chainMatch).length > 0
        ? { $and: [baseMatch, chainMatch] }
        : baseMatch;

    const customers = await BBSCARTUser.find(finalMatch).sort({
      createdAt: -1,
    });

    return res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching filtered customers from BBSlive:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

