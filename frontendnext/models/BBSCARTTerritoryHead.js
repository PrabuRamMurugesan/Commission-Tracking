// models/BBSCARTTerritoryHead.js
import mongoose from "mongoose";

// Try territoryheads collection first, fallback to agents with role filter
const BBSCARTTerritoryHeadSchema = new mongoose.Schema(
  {},
  {
    collection: "territoryheads", // BBSlive.territoryheads collection (if exists)
    strict: false, // use existing fields as-is (vendor_fname, pan_number, etc.)
  }
);

export default mongoose.models.BBSCARTTerritoryHead ||
  mongoose.model("BBSCARTTerritoryHead", BBSCARTTerritoryHeadSchema);
