// models/BBSCARTFranchiseHead.js
import mongoose from "mongoose";

const BBSCARTFranchiseHeadSchema = new mongoose.Schema(
  {},
  {
    collection: "franchiseheads", // BBSlive.franchiseheads collection
    strict: false, // use existing fields as-is (vendor_fname, pan_number, etc.)
  }
);

export default mongoose.models.BBSCARTFranchiseHead ||
  mongoose.model("BBSCARTFranchiseHead", BBSCARTFranchiseHeadSchema);
