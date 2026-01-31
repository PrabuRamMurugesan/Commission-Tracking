const mongoose = require("mongoose");

const HierarchyManagementSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  parentId: { type: String, required: true }, // Parent User ID in hierarchy
});

module.exports = mongoose.model("HierarchyManagement", HierarchyManagementSchema);
