// // pages/api/ingest/territory-upsert.js
// // Upserts Territory Head (or Territory) master data.

// import crypto from "crypto";
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/commissioncrm";
// const SERVICE_TOKEN = process.env.SERVICE_TOKEN || "";

// let connPromise = global._crm_conn || (global._crm_conn = mongoose.connect(MONGODB_URI));

// const idemSchema = new mongoose.Schema(
//   { key: String, endpoint: String, bodyHash: String, createdAt: { type: Date, default: Date.now } },
//   { collection: "idempotency_keys" }
// );
// idemSchema.index({ key: 1, endpoint: 1 }, { unique: true });
// const IdemKey = mongoose.models.IdempotencyKey || mongoose.model("IdempotencyKey", idemSchema);

// const territorySchema = new mongoose.Schema(
//   {
//     territoryId: { type: String, required: true, unique: true, index: true },
//     name: String,
//     headUserId: String,     // optional: user id of territory head
//     region: String,
//     contact: { phone: String, email: String },
//     active: { type: Boolean, default: true },
//     meta: mongoose.Schema.Types.Mixed,
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
//   },
//   { collection: "territories" }
// );
// const Territory = mongoose.models.Territory || mongoose.model("Territory", territorySchema);

// function cors(res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Idempotency-Key");
// }

// function unauthorized(res) {
//   return res.status(401).json({ ok: false, error: "unauthorized" });
// }

// async function checkIdempotency(req, endpoint) {
//   const key = req.headers["x-idempotency-key"];
//   if (!key) return { ok: false, error: "missing idempotency key" };
//   const bodyHash = crypto.createHash("sha256").update(JSON.stringify(req.body || {})).digest("hex");
//   await connPromise;
//   try {
//     await IdemKey.create({ key, endpoint, bodyHash, createdAt: new Date() });
//     return { ok: true, dedup: false };
//   } catch {
//     return { ok: true, dedup: true };
//   }
// }

// export default async function handler(req, res) {
//   cors(res);
//   if (req.method === "OPTIONS") return res.status(204).end();
//   if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method not allowed" });

//   const auth = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
//   if (!SERVICE_TOKEN || auth !== SERVICE_TOKEN) return unauthorized(res);

//   const idr = await checkIdempotency(req, "territory-upsert");
//   if (!idr.ok) return res.status(400).json({ ok: false, error: idr.error });
//   if (idr.dedup) return res.status(200).json({ ok: true, dedup: true });

//   const { territoryId, name, headUserId, region, contact, active, meta, createdAt, updatedAt } = req.body || {};
//   if (!territoryId) return res.status(400).json({ ok: false, error: "territoryId is required" });

//   await connPromise;

//   const $set = {
//     ...(name != null ? { name } : {}),
//     ...(headUserId != null ? { headUserId } : {}),
//     ...(region != null ? { region } : {}),
//     ...(contact != null ? { contact } : {}),
//     ...(active != null ? { active } : {}),
//     ...(meta != null ? { meta } : {}),
//     updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
//   };
//   const $setOnInsert = {
//     createdAt: createdAt ? new Date(createdAt) : new Date(),
//   };

//   await Territory.findOneAndUpdate({ territoryId }, { $set, $setOnInsert }, { upsert: true, new: true });

//   return res.status(200).json({ ok: true, dedup: false });
// }


// pages/api/ingest/territory-upsert.js
import withCors from "../../../lib/withCors";
import { verifyAuth } from "../../../lib/crmSecurity";
import { checkIdempotency, writeIdempotency } from "../../../lib/idempotencyService";
import { connectDB } from "../../../lib/db"; // your existing commissioncrm connection
// 👉 write to BBSlive
//  import TerritoryHead from "../../../models/bbslive/TerritoryHead";       // ✅ BBSlive model
// (Optional) lightweight mirror for CRM lists, if you still use them:
import mongoose from "mongoose";



const MirrorSchema = new mongoose.Schema(
  {
    territoryId: { type: String, index: true },
    name: String,
    email: String,
    phone: String,
    bpc: String,
    platform: String,
    zone: String,
    accountStatus: String,
    approved_at: Date,
  },
  { timestamps: true, strict: false, collection: "territories" }
);
async function TerritoryMirror() {
  // await connectDB(); // commissioncrm
 await connectBBSlive();                // ✅ correct for BBSlive writes
  return mongoose.models.TerritoryMirror || mongoose.model("TerritoryMirror", MirrorSchema);
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  // 1) Auth + Idempotency
  try {
    verifyAuth(req); // Authorization: Bearer <SERVICE_TOKEN>
  } catch (e) {
    return res.status(401).json({ ok: false, error: "unauthorized", details: e.message });
  }

  const idemKey = req.headers["x-idempotency-key"];
  if (!idemKey) return res.status(400).json({ ok: false, error: "idempotency_required" });

  const already = await checkIdempotency(idemKey);
  if (already) return res.json({ ok: false, dedup: true });

  const b = req.body || {};

  // 2) Basic validation (keep loose—BBSlive is source of truth for full profile)
  if (!b.territoryId || !b.name || !b.email) {
    return res.status(400).json({ ok: false, error: "missing_fields", fields: ["territoryId","name","email"] });
  }

  // Normalize status/approved date fields
  const core = {
    territoryId: String(b.territoryId).trim(),
    name: String(b.name).trim(),
    email: String(b.email).trim(),
    phone: b.phone ? String(b.phone).trim() : undefined,
    whatsappNumber: b.whatsappNumber ? String(b.whatsappNumber).trim() : undefined,
    bpc: b.bpc ? String(b.bpc).trim() : undefined,
    platform: b.platform ? String(b.platform).trim() : "BBSCART",
    zone: b.zone ? String(b.zone).trim() : undefined,
    stateCode: b.stateCode ? String(b.stateCode).trim() : undefined,
    cityCode: b.cityCode ? String(b.cityCode).trim() : undefined,
    accountStatus: b.accountStatus ? String(b.accountStatus).trim() : "active",
    approved_at: b.approved_at ? new Date(b.approved_at) : undefined,
  };

  // 3) Upsert into BBSlive.territoryheads (full profile allowed)
  try {
    const Territory = await TerritoryHeadModel();
    const result = await Territory.updateOne(
      { territoryId: core.territoryId },
      {
        $set: { ...core },
        // Everything else—including your large address, KYC, GST blocks—flows as “profile”
        $setOnInsert: { createdAt: new Date() },
        $push: {},
        $addToSet: {},
        ...(b.profile ? { $set: { profile: b.profile } } : {}), // optional bundle
        ...(b.register_business_address
          ? { $set: { register_business_address: b.register_business_address } }
          : {}),
        ...(b.gst_address ? { $set: { gst_address: b.gst_address } } : {}),
      },
      { upsert: true }
    );

    // 4) (Optional) mirror slim row in commissioncrm.territories so your CRM list loads instantly
    try {
      const Mirror = await TerritoryMirror();
      await Mirror.updateOne(
        { territoryId: core.territoryId },
        { $set: core },
        { upsert: true }
      );
    } catch (e) {
      // Non-fatal: lists can also read directly from BBSlive via API if preferred
      console.warn("[mirror] write skipped:", e.message);
    }

    // 5) Record idempotency last
    await writeIdempotency(idemKey, { scope: "territory-upsert", ref: core.territoryId });

    return res.json({
      ok: true,
      upserted: !!result.upsertedId || result.modifiedCount || result.matchedCount,
      territoryId: core.territoryId,
    });
  } catch (e) {
    console.error("territory-upsert error:", e);
    return res.status(500).json({ ok: false, error: "write_failed", details: e.message });
  }
}

export default withCors(handler);
