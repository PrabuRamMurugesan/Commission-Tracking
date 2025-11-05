// models/bbslive/TerritoryHead.js
import { getBBSliveDb } from "../../lib/bbsliveDb.js";
import mongoose from "mongoose";

const TerritoryHeadSchema = new mongoose.Schema(
  {
    // Keep flexible: you showed many keys in BBSlive.territoryheads JSON,
    // including pan_number, aadhar_number, gst_*, register_business_address, etc.
    // We store core columns explicitly and allow the rest via strict:false.
    territoryId: { type: String, index: true },  // e.g. "TH-86463"
    name: String,
    email: String,
    phone: String,
    whatsappNumber: String,

    // BPC + platform/zone/state/city per your UI
    bpc: String,
    platform: String,      // "BBSCART" | "Thiaworld" | "HealthAccess" | "All"
    zone: String,
    stateCode: String,
    cityCode: String,

    accountStatus: String, // active/inactive, etc.
    approved_at: Date,

    // Anything extra flows here without blocking
  },
  { timestamps: true, strict: false, collection: "territoryheads" }
);

export async function TerritoryHeadModel() {
  const conn = await getBBSliveDb();
  // Important: prevent OverwriteModelError for HMR
  return conn.models.TerritoryHead || conn.model("TerritoryHead", TerritoryHeadSchema);
}
