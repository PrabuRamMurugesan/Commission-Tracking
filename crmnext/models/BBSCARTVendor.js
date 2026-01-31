// models/BBSCARTVendor.js
import mongoose from "mongoose";

const BBSCARTVendorSchema = new mongoose.Schema(
  {},
  {
    collection: "vendors", // BBSlive.vendors collection
    strict: false, // use existing fields as-is (vendor_fname, pan_number, etc.)
  }
);

export default mongoose.models.BBSCARTVendor ||
  mongoose.model("BBSCARTVendor", BBSCARTVendorSchema);
