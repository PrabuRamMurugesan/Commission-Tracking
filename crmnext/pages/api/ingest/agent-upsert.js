// pages/api/ingest/agent-upsert.js
// Upserts Agent master data. Secured + idempotent.
// Headers required:
//   Authorization: Bearer <SERVICE_TOKEN>
//   X-Idempotency-Key: <string>

import crypto from "crypto";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/commissioncrm";
const SERVICE_TOKEN = process.env.SERVICE_TOKEN || "";

// ---------- DB connect (singleton) ----------
let connPromise = global._crm_conn;
if (!connPromise) {
  connPromise = mongoose.connect(MONGODB_URI, { dbName: undefined });
  global._crm_conn = connPromise;
}

// ---------- Idempotency model ----------
const idemSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, index: true },
    endpoint: { type: String, required: true, index: true },
    bodyHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { collection: "idempotency_keys" }
);
const IdemKey = mongoose.models.IdempotencyKey || mongoose.model("IdempotencyKey", idemSchema);

// ---------- Agent model ----------
const agentSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true, unique: true, index: true },
    name: String,
    franchiseId: String,
    territoryId: String,
    contact: {
      phone: String,
      email: String,
    },
    active: { type: Boolean, default: true },
    meta: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "agents" }
);
const Agent = mongoose.models.Agent || mongoose.model("Agent", agentSchema);

// ---------- helpers ----------
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
  if (!key || typeof key !== "string") return { ok: false, error: "missing idempotency key" };

  const bodyHash = crypto.createHash("sha256").update(JSON.stringify(req.body || {})).digest("hex");
  await connPromise;

  const found = await IdemKey.findOne({ key, endpoint }).lean();
  if (found) {
    return { ok: true, dedup: true };
  }
  await IdemKey.create({ key, endpoint, bodyHash, createdAt: new Date() });
  return { ok: true, dedup: false };
}

// ---------- handler ----------
export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "method not allowed" });

  const auth = (req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!SERVICE_TOKEN || auth !== SERVICE_TOKEN) return unauthorized(res);

  const idr = await checkIdempotency(req, "agent-upsert");
  if (!idr.ok) return res.status(400).json({ ok: false, error: idr.error });
  if (idr.dedup) return res.status(200).json({ ok: true, dedup: true });

  const {
    agentId,
    name,
    franchiseId,
    territoryId,
    contact,
    active,
    meta,
    createdAt,
    updatedAt,
  } = req.body || {};

  if (!agentId) return res.status(400).json({ ok: false, error: "agentId is required" });

  await connPromise;

  const $set = {
    ...(name != null ? { name } : {}),
    ...(franchiseId != null ? { franchiseId } : {}),
    ...(territoryId != null ? { territoryId } : {}),
    ...(contact != null ? { contact } : {}),
    ...(active != null ? { active } : {}),
    ...(meta != null ? { meta } : {}),
    updatedAt: updatedAt ? new Date(updatedAt) : new Date(),
  };
  const $setOnInsert = {
    createdAt: createdAt ? new Date(createdAt) : new Date(),
  };

  await Agent.findOneAndUpdate({ agentId }, { $set, $setOnInsert }, { upsert: true, new: true });

  return res.status(200).json({ ok: true, dedup: false });
}
