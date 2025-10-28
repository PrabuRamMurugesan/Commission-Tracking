// pages/api/ingest/franchise-upsert.js
// Upserts Franchise master data (secured + idempotent).

import crypto from "crypto";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/commissioncrm";
const SERVICE_TOKEN = process.env.SERVICE_TOKEN || "";

let connPromise = global._crm_conn || (global._crm_conn = mongoose.connect(MONGODB_URI));

const idemSchema = new mongoose.Schema(
  { key: String, endpoint: String, bodyHash: String, createdAt: { type: Date, default: Date.now } },
  { collection: "idempotency_keys" }
);
idemSchema.index({ key: 1, endpoint: 1 }, { unique: true });
const IdemKey = mongoose.models.IdempotencyKey || mongoose.model("IdempotencyKey", idemSchema);

const franchiseSchema = new mongoose.Schema(
  {
    franchiseId: { type: String, required: true, unique: true, index: true },
    name: String,
    territoryId: String,
    ownerUserId: String,
    contact: { phone: String, email: String },
    active: { type: Boolean, default: true },
    meta: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "franchises" }
);
const Franchise = mongoose.models.Franchise || mongoose.model("Franchise", franchiseSchema);

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Idempotency-Key");
}

function unauthorized(res) {
  return res.status(401).json({ ok: false, error: "unauthorized" });
}

async function checkIdempotency(req, endpoint) {
  const key = req.headers["x-idempotency-key"];
  if (!key) return { ok: false, error: "missing idempotency key" };
  const bodyHash = crypto.createHash("sha256").update(JSON.stringify(req.body || {})).digest("hex");
  await connPromise;
  try {
    await IdemKey.create({ key, endpoint, bodyHash, createdAt: new Date() });
    return { ok: true, dedup: false };
  } catch {
    return { ok: true, dedup: true };
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method not allowed" });

  const auth = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!SERVICE_TOKEN || auth !== SERVICE_TOKEN) return unauthorized(res);

  const idr = await checkIdempotency(req, "franchise-upsert");
  if (!idr.ok) return res.status(400).json({ ok: false, error: idr.error });
  if (idr.dedup) return res.status(200).json({ ok: true, dedup: true });

  const { franchiseId, name, territoryId, ownerUserId, contact, active, meta, createdAt, updatedAt } = req.body || {};
  if (!franchiseId) return res.status(400).json({ ok: false, error: "franchiseId is required" });

  await connPromise;

  const $set = {
    ...(name != null ? { name } : {}),
    ...(territoryId != null ? { territoryId } : {}),
    ...(ownerUserId != null ? { ownerUserId } : {}),
    ...(contact != null ? { contact } : {}),
    ...(active != null ? { active } : {}),
    ...(meta != null ? { meta } : {}),
    updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
  };
  const $setOnInsert = {
    createdAt: createdAt ? new Date(createdAt) : new Date(),
  };

  await Franchise.findOneAndUpdate({ franchiseId }, { $set, $setOnInsert }, { upsert: true, new: true });

  return res.status(200).json({ ok: true, dedup: false });
}
