// models/BBSCARTAgent.js
import mongoose from "mongoose";

const BBSCARTAgentSchema = new mongoose.Schema(
  {},
  {
    collection: "agents", // BBSlive.agents collection
    strict: false, // use existing fields as-is (vendor_fname, pan_number, etc.)
  }
);

export default mongoose.models.BBSCARTAgent ||
  mongoose.model("BBSCARTAgent", BBSCARTAgentSchema);
