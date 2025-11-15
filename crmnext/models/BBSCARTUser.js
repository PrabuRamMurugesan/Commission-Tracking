// models/BBSCARTUser.js
import mongoose from "mongoose";

const BBSCARTUserSchema = new mongoose.Schema(
  {},
  {
    collection: "users", // BBSlive.users collection
    strict: false, // use existing fields as-is (role, vendor_id, etc.)
  }
);

export default mongoose.models.BBSCARTUser ||
  mongoose.model("BBSCARTUser", BBSCARTUserSchema);
