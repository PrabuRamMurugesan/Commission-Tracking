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
import crypto from "crypto";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/BBSlive";
const SERVICE_TOKEN = process.env.SERVICE_TOKEN || "";

let connPromise = global._bbslive_conn || (global._bbslive_conn = mongoose.connect(MONGODB_URI, { autoIndex: true }));

// ----- Idempotency collection -----
const idemSchema = new mongoose.Schema(
  { key: String, endpoint: String, bodyHash: String, createdAt: { type: Date, default: Date.now } },
  { collection: "idempotency_keys" }
);
idemSchema.index({ key: 1, endpoint: 1 }, { unique: true });
const IdemKey = mongoose.models.IdempotencyKey || mongoose.model("IdempotencyKey", idemSchema);

// ----- TerritoryHeads (target = BBSlive.territoryheads) -----
const thSchema = new mongoose.Schema(
  {
    territoryId: { type: String, required: true, unique: true, index: true },
    // core identity
    name: String,
    email: String,
    phone: String,
    whatsappNumber: String,
    designation: { type: String, default: "Territory" },
    // business routing/display
    zone: String,
    businessPartnerCode: String, // BPC
    platform: { type: String, enum: ["BBSCART","Thiaworld","HealthAccess","All"], default: "BBSCART" },
    stateCode: String,
    cityCode: String,
    franchiseeId: mongoose.Schema.Types.ObjectId,
    // status & dates
    accountStatus: { type: String, default: "pending" }, // "active"/"pending"/"inactive"
    joinedDate: Date,     // approved_at
    // optional UI/analytics
    totalCustomers: { type: Number, default: 0 },
    totalTransactions: { type: Number, default: 0 },
    commissionEarned: { type: Number, default: 0 },
    commissionPending: { type: Number, default: 0 },
    commissionRates: [ { platform: String, productCategory: String, rate: Number } ],
    // everything else to avoid loss
    extras: mongoose.Schema.Types.Mixed,
    // audit
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: "territoryheads" }
);
const TerritoryHead = mongoose.models.TerritoryHead || mongoose.model("TerritoryHead", thSchema);

// --- helpers ---
function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Idempotency-Key");
}
function unauthorized(res) { return res.status(401).json({ ok:false, error:"unauthorized" }); }

async function checkIdem(req, endpoint) {
  const key = req.headers["x-idempotency-key"];
  if (!key) return { ok:false, error:"missing idempotency key" };
  const bodyHash = crypto.createHash("sha256").update(JSON.stringify(req.body || {})).digest("hex");
  await connPromise;
  try {
    await IdemKey.create({ key, endpoint, bodyHash, createdAt: new Date() });
    return { ok:true, dedup:false };
  } catch {
    return { ok:true, dedup:true };
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok:false, error:"method not allowed" });

  const auth = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!SERVICE_TOKEN || auth !== SERVICE_TOKEN) return unauthorized(res);

  const idem = await checkIdem(req, "territory-upsert");
  if (!idem.ok) return res.status(400).json({ ok:false, error:idem.error });
  if (idem.dedup) return res.status(200).json({ ok:true, dedup:true });

  await connPromise;

  const body = req.body || {};
  const {
    territoryId,
    name, email, phone, whatsappNumber,
    designation, zone, businessPartnerCode, bpc, // allow bpc alias
    platform, stateCode, cityCode, franchiseeId,
    status, accountStatus,
    approved_at, joinedDate,
    totalCustomers, totalTransactions, commissionEarned, commissionPending,
    commissionRates,
    createdAt, updatedAt,
    ...rest
  } = body;

  if (!territoryId) return res.status(400).json({ ok:false, error:"territoryId is required" });

  const doc = {
    territoryId,
    name: name ?? null,
    email: email ?? null,
    phone: phone ?? null,
    whatsappNumber: whatsappNumber ?? null,
    designation: designation || "Territory",
    zone: zone ?? null,
    businessPartnerCode: businessPartnerCode || bpc || null,
    platform: platform || "BBSCART",
    stateCode: stateCode ?? null,
    cityCode: cityCode ?? null,
    franchiseeId: franchiseeId ? new mongoose.Types.ObjectId(franchiseeId) : undefined,
    accountStatus: accountStatus || (status === "active" ? "active" : status === "inactive" ? "inactive" : "pending"),
    joinedDate: joinedDate ? new Date(joinedDate) : (approved_at ? new Date(approved_at) : new Date()),
    totalCustomers: Number.isFinite(totalCustomers) ? totalCustomers : 0,
    totalTransactions: Number.isFinite(totalTransactions) ? totalTransactions : 0,
    commissionEarned: Number.isFinite(commissionEarned) ? commissionEarned : 0,
    commissionPending: Number.isFinite(commissionPending) ? commissionPending : 0,
    commissionRates: Array.isArray(commissionRates) ? commissionRates : [],
    extras: Object.keys(rest).length ? rest : undefined,
    updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
  };

  const setOnInsert = { createdAt: createdAt ? new Date(createdAt) : new Date() };

  await TerritoryHead.updateOne(
    { territoryId },
    { $set: doc, $setOnInsert: setOnInsert },
    { upsert: true }
  );

  return res.status(200).json({ ok:true, territoryId });
}
