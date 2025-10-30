// import { withCors } from '../../../lib/withCors';
// import { serviceToken } from '../../../lib/crmSecurity';
// import { checkAndLock } from '../../../lib/idempotencyService';

// async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

//   const auth = req.headers.authorization || '';
//   const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7) : '';
//   if (token !== serviceToken) return res.status(401).json({ ok: false, error: 'invalid service token' });

//   const key = req.headers['x-idempotency-key'];
//   const body = req.body || {};
//   const lock = await checkAndLock('vendor-upsert', key, body);
//   if (!lock.ok && lock.reason === 'duplicate_exact') return res.json({ ok: true, dedup: true });
//   if (!lock.ok) return res.status(409).json({ ok: false, error: lock.reason });

//   return res.json({ ok: true, received: true });
// }

// export default withCors(handler);


// pages/api/ingest/vendor-upsert.js  (CRM)
// Inserts/updates vendor into commissioncrm.vendors with idempotency + auth.

import mongoose from "mongoose";
import { withCors } from "../../../lib/withCors";
import { serviceToken } from "../../../lib/crmSecurity";
import { checkAndLock } from "../../../lib/idempotencyService";

const MONGODB_URI = process.env.MONGODB_URI;

// Minimal Vendor doc shape for CRM (keep this local to the route)
const VendorSchema = new mongoose.Schema(
  {
    vendorId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    gstNumber: { type: String },
    status: { type: String, default: "active" },
    address: { type: Object }, // keep flexible for now
  },
  { timestamps: true }
);

// Force collection name to "vendors"
const CrmVendor =
  mongoose.models.CrmVendor || mongoose.model("CrmVendor", VendorSchema, "vendors");

async function ensureConnected() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI missing");
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

function isAuthed(req) {
  const h = req.headers?.authorization || "";
  const token = h.toLowerCase().startsWith("bearer ") ? h.slice(7) : "";
  return token && token === serviceToken;
}

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  // 1) Auth
  if (!isAuthed(req)) {
    return res.status(401).json({ ok: false, error: "invalid service token" });
  }

  // 2) Idempotency
  const idemKey = req.headers["x-idempotency-key"];
  const body = req.body || {};
  const lock = await checkAndLock("vendor-upsert", idemKey, body);
  if (!lock.ok && lock.reason === "duplicate_exact") {
    return res.json({ ok: true, dedup: true });
  }
  if (!lock.ok) {
    return res.status(409).json({ ok: false, error: lock.reason });
  }

  // 3) Validate required fields
  const { vendorId, name, email, phone, gstNumber, status, address } = body;
  if (!vendorId || !name) {
    return res.status(400).json({ ok: false, error: "vendorId and name are required" });
  }

  // 4) Connect + Upsert
  await ensureConnected();

  const filter = { vendorId };
  const $set = {
    vendorId,
    name,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {}),
    ...(gstNumber ? { gstNumber } : {}),
    ...(status ? { status } : {}),
    ...(address ? { address } : {}),
    updatedAt: new Date(),
  };

  const write = await CrmVendor.updateOne(
    filter,
    { $set, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  // 5) Read-back for confirmation
  const doc = await CrmVendor.findOne(filter).lean();
  return res.json({
    ok: true,
    matched: write.matchedCount ?? 0,
    modified: write.modifiedCount ?? 0,
    upsertedId: write.upsertedId ? write.upsertedId._id || write.upsertedId : null,
    docId: doc?._id?.toString() || null,
    collection: "vendors",
  });
}

export default withCors(handler);
