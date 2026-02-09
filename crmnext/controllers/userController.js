
import User from "../models/User";
import { connectDB } from "../lib/db";

export const createUser = async (req, res) => {
  try {
    await connectDB();
    const { name, email, role, status } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Normalize role values to match User model enum
    const roleMapping = {
      "Admin": "admin",
      "Franchise": "franchisee",
      "Franchisee": "franchisee",
      "Agent": "agent",
      "Customer": "customer",
      "Vendor": "vendor",
      "Territory": "territory",
      "CBV": "cbav",
      "admin": "admin",
      "franchisee": "franchisee",
      "agent": "agent",
      "customer": "customer",
      "vendor": "vendor",
      "territory": "territory",
      "cbav": "cbav",
    };

    const normalizedRole = roleMapping[role] || role?.toLowerCase() || "customer";
    
    // Validate role is in enum
    const validRoles = ["admin", "vendor", "franchisee", "territory", "agent", "cbav", "customer"];
    if (!validRoles.includes(normalizedRole)) {
      return res.status(400).json({ 
        message: `Invalid role. Valid roles are: ${validRoles.join(", ")}` 
      });
    }

    // Convert status (boolean) to accountStatus (string enum)
    let accountStatus = "active";
    if (status === false || status === "false" || status === "inactive") {
      accountStatus = "inactive";
    } else if (status === "suspended") {
      accountStatus = "suspended";
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: normalizedRole,
      accountStatus: accountStatus,
    });

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.error("Create user error:", err);
    
    // Handle validation errors
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: `Validation error: ${validationErrors.join(", ")}` 
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    res.status(500).json({ 
      message: "Error creating user", 
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
    });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    await connectDB();

    const { page = 1, status, role } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    const query = {};

    // ✅ STATUS FILTER
    if (status === "true") {
      query.accountStatus = "active";
    } else if (status === "false") {
      query.accountStatus = "inactive";
    }

    // ✅ ROLE FILTER
    if (role) {
      query.role = role.toLowerCase();
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUserById = async (req, res) => {
  await connectDB();
  try {
    await User.findByIdAndDelete(req.query.id);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateUserById = async (req, res) => {
  await connectDB();
  try {
    const { name, email, role, status } = req.body;
    const userId = req.query.id || req.params?.id;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    
    // Normalize role if provided
    if (role) {
      const roleMapping = {
        "Admin": "admin",
        "Franchise": "franchisee",
        "Franchisee": "franchisee",
        "Agent": "agent",
        "Customer": "customer",
        "Vendor": "vendor",
        "Territory": "territory",
        "CBV": "cbav",
        "admin": "admin",
        "franchisee": "franchisee",
        "agent": "agent",
        "customer": "customer",
        "vendor": "vendor",
        "territory": "territory",
        "cbav": "cbav",
      };
      const normalizedRole = roleMapping[role] || role?.toLowerCase();
      const validRoles = ["admin", "vendor", "franchisee", "territory", "agent", "cbav", "customer"];
      if (validRoles.includes(normalizedRole)) {
        updateData.role = normalizedRole;
      }
    }
    
    // Convert status (boolean) to accountStatus (string enum)
    if (status !== undefined) {
      if (status === false || status === "false" || status === "inactive") {
        updateData.accountStatus = "inactive";
      } else if (status === "suspended") {
        updateData.accountStatus = "suspended";
      } else {
        updateData.accountStatus = "active";
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update user error:", err);
    
    // Handle validation errors
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        message: `Validation error: ${validationErrors.join(", ")}` 
      });
    }
    
    res.status(500).json({ 
      message: "Error updating user",
      error: process.env.NODE_ENV === "development" ? err.message : undefined 
    });
  }
};
export const getUserById = async (req, res) => {
  await connectDB();
  try {
    const user = await User.findById(req.query.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const bulkDeleteUsers = async (req, res) => {
  try {
    await connectDB();

    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "No users provided" });
    }

    await User.deleteMany({
      _id: { $in: users },
    });

    res.status(200).json({
      message: "Users deleted successfully",
      deletedCount: users.length,
    });
  } catch (err) {
    console.error("Bulk delete error:", err);
    res.status(500).json({ message: "Bulk delete failed" });
  }
};
