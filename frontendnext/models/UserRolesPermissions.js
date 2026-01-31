const mongoose = require("mongoose");

const UserRolesPermissionsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  permissions: { type: [String], required: true }, // Array of permissions
});

module.exports = mongoose.model("UserRolesPermissions", UserRolesPermissionsSchema);
