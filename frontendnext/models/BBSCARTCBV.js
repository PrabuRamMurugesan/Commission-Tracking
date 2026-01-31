// models/BBSCARTCBV.js
import mongoose from "mongoose";

const BBSCARTCBVSchema = new mongoose.Schema(
  {},
  {
    collection: "customervendors", // BBSlive.customervendors collection
    strict: false, // use existing fields as-is (vendor_fname, pan_number, etc.)
  }
);

export default mongoose.models.BBSCARTCBV ||
  mongoose.model("BBSCARTCBV", BBSCARTCBVSchema);
