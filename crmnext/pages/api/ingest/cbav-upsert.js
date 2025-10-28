// pages/api/ingest/cbav-upsert.js
// Upserts CBAV (Customer Become A Vendor) applications/records.

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

const cbavSchema = new mongoose.Schema(
  {
    cbavId: { type: String, required: true, unique: true, index: true },
    customerId: String,
    vendorId: String,          // when approved/linked
    status: { type: String, default: "pending" }, // pending|approved|rejected
    appliedAt: Date,
    approvedAt: Date,
    meta: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "cbav" }
);
const Cbav = mongoose.models.Cbav || mongoose.model("Cbav", cbavSchema);

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

  const idr = await checkIdempotency(req, "cbav-upsert");
  if (!idr.ok) return res.status(400).json({ ok: false, error: idr.error });
  if (idr.dedup) return res.status(200).json({ ok: true, dedup: true });

  const {
    cbavId,
    customerId,
    vendorId,
    status,
    appliedAt,
    approvedAt,
    meta,
    createdAt,
    updatedAt,
  } = req.body || {};
  if (!cbavId) return res.status(400).json({ ok: false, error: "cbavId is required" });

  await connPromise;

  const $set = {
    ...(customerId != null ? { customerId } : {}),
    ...(vendorId != null ? { vendorId } : {}),
    ...(status != null ? { status } : {}),
    ...(appliedAt != null ? { appliedAt: new Date(appliedAt) } : {}),
    ...(approvedAt != null ? { approvedAt: new Date(approvedAt) } : {}),
    ...(meta != null ? { meta } : {}),
    updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
  };
  const $setOnInsert = {
    createdAt: createdAt ? new Date(createdAt) : new Date(),
  };

  await Cbav.findOneAndUpdate({ cbavId }, { $set, $setOnInsert }, { upsert: true, new: true });

  return res.status(200).json({ ok: true, dedup: false });
}
