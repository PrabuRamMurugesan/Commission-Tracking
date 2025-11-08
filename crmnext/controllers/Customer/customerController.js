import Customer from "../../models/Customer/Customer.js";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/db.js";
import { validateCustomerPayload } from "../../utils/validateCustomer.js";
import Agent from "../../models/Agent/Agent.js";
import Vendor from "../../models/Vendor.js";
import Cbv from "../../models/Cbv/Cbv.js";
import Franchise from "../../models/Franchise/Franchise.js";
import Territory from "../../models/Territory/TerritoryHead.js";
import { getBBSliveDb } from "../../lib/db.js";

// ✅ GET All Customers from BBSlive (supports filters)
export const getAllCustomers = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection("customervendors");

    // Optional filters coming from UI
    const {
      platform,
      agentId,
      franchiseId,
      territoryId,
      vendorId,
      cbvId,
      q, // free text: name/email/phone
    } = req.query;

    const filter = {};
    if (platform) filter.platform = platform;
    if (agentId) filter.agentId = agentId;
    if (franchiseId) filter.franchiseId = franchiseId;
    if (territoryId) filter.territoryId = territoryId;
    if (vendorId) filter.vendorId = vendorId;
    if (cbvId) filter.cbvId = cbvId;

    // optional text search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }

    // fetch raw docs from BBSlive
    const docs = await col.find(filter).sort({ created_at: -1 }).limit(1000).toArray();

    // helper getter
    const g = (o, p, d = "—") => {
      try { return p.split(".").reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o) ?? d; }
      catch { return d; }
    };

    // normalize to flat keys the table expects
    const customers = docs.map((d) => {
      const name =
        d.name ||
        [d.firstName, d.lastName].filter(Boolean).join(" ").trim() ||
        [d.vendor_fname, d.vendor_lname].filter(Boolean).join(" ").trim() ||
        "—";

      const email = d.email || "—";
      const phone = d.phone || d.whatsappNumber || "—";

      const district = d.district || g(d, "address.district") || g(d, "gst_address.district");
      const state =
        d.state ||
        g(d, "address.state") ||
        g(d, "register_address.state") ||
        g(d, "register_business_address.state");
      const city =
        d.city ||
        g(d, "address.city") ||
        g(d, "register_address.city") ||
        g(d, "register_business_address.city");
      const pincode =
        d.pincode ||
        g(d, "address.postalCode") ||
        g(d, "register_address.postalCode") ||
        g(d, "register_business_address.postalCode");

      const accountStatus = d.accountStatus || (d.is_active ? "active" : "pending");
      const joinedDate = d.joinedDate || d.created_at || d.updated_at;

      return {
        _id: String(d._id || ""),
        name,
        email,
        phone,
        pan: d.pan || d.pan_number || "—",          // usually empty for customers
        gstin: d.gstin || d.gst_number || "—",      // usually empty for customers
        platform: d.platform || "BBSCART",
        status: accountStatus,
        district,
        state,
        city,
        pincode,
        totalCustomers: 0,
        totalTransactions: d.totalTransactions || 0,
        commissionEarned: d.commissionEarned || 0,
        commissionPending: d.commissionPending || 0,
        joinedDate,
        createdAt: d.created_at || d.createdAt || null,
      };
    });

    return res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers (BBSlive):", error);
    return res.status(500).json({ message: "Failed to fetch customers" });
  }
};

// ✅ GET Single Customer by ID from BBSlive
export const getCustomerById = async (req, res) => {
  try {
    const db = await getBBSliveDb();
    const col = db.collection("customers");
    const { id } = req.query;

    const { ObjectId } = await import("mongodb");
    const q = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { customerId: id };
    const d = await col.findOne(q);
    if (!d) return res.status(404).json({ message: "Customer not found" });

    const g = (o, p, dft = "—") => {
      try { return p.split(".").reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o) ?? dft; }
      catch { return dft; }
    };

    const customer = {
      _id: String(d._id || ""),
      name: d.name || [d.firstName, d.lastName].filter(Boolean).join(" ").trim() || "—",
      email: d.email || "—",
      phone: d.phone || d.whatsappNumber || "—",
      pan: d.pan || d.pan_number || "—",
      gstin: d.gstin || d.gst_number || "—",
      platform: d.platform || "BBSCART",
      status: d.accountStatus || (d.is_active ? "active" : "pending"),
      district: d.district || g(d, "address.district"),
      state: d.state || g(d, "address.state"),
      city: d.city || g(d, "address.city"),
      pincode: d.pincode || g(d, "address.postalCode"),
      createdAt: d.created_at || d.createdAt || null,
      // referral links (if you need them in detail views)
      agentId: d.agentId,
      franchiseId: d.franchiseId,
      territoryId: d.territoryId,
      vendorId: d.vendorId,
      cbvId: d.cbvId,
    };

    return res.status(200).json({ customer });
  } catch (error) {
    console.error("Get customer (BBSlive) error:", error);
    return res.status(500).json({ message: "Failed to fetch customer" });
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
