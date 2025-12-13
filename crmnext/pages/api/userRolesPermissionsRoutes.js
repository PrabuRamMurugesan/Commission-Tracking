const express = require("express");
const router = express.Router();
const UserRolesPermissions = require("../models/UserRolesPermissions");

// ✅ Fetch User Roles & Permissions
router.get("/user-roles-permissions", async (req, res) => {
  try {
    const rolesPermissions = await UserRolesPermissions.find();
    res.json(rolesPermissions);
  } catch (error) {
    console.error("Error fetching roles & permissions:", error);
    res.status(500).json({ message: "Error retrieving roles & permissions" });
  }
});

module.exports = router;
