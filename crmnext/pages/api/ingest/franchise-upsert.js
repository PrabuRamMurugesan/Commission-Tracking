

// pages/api/ingest/franchise-upsert.js
import { MongoClient } from "mongodb";

// ---- Config ----
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/BBSlive";
const DB_NAME = process.env.DB_NAME || "BBSlive";
const SERVICE_TOKEN = process.env.SERVICE_TOKEN || ""; // 64-hex recommended
const COLLECTION = "franchiseheads";
const IDEMPOTENCY_COLLECTION = "idempotency_keys";

let _client;
async function getDb() {
  if (!_client) {
    _client = new MongoClient(MONGO_URI, { ignoreUndefined: true });
    await _client.connect();
  }
  return _client.db(DB_NAME);
}

// Read token from either X-Service-Token or Authorization: Bearer
function readServiceToken(req) {
  const xTok = req.headers["x-service-token"];
  if (xTok && typeof xTok === "string" && xTok.trim()) return xTok.trim();

  const auth = req.headers["authorization"];
  if (auth && typeof auth === "string") {
    const m = auth.match(/^Bearer\s+(.+)$/i);
    if (m) return m[1].trim();
  }
  return "";
}

function readIdempotencyKey(req) {
  const k = req.headers["x-idempotency-key"];
  return (typeof k === "string" && k.trim()) ? k.trim() : "";
}

// Allow simple CORS for local tools
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Service-Token, X-Idempotency-Key, X-Requested-With, Accept, Origin"
  );
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // Sanity GET (mirror of territory GET you used)
  // if (req.method === "GET") {
  //   try {
  //     const db = await getDb();
  //     const col = db.collection(COLLECTION);
  //     const items = await col
  //       .find({}, { projection: { _id: 1 } })
  //       .limit(5)
  //       .toArray();
  //     return res.status(200).json({ ok: true, count: items.length, items });
  //   } catch (e) {
  //     console.error("[franchise-upsert][GET] error:", e);
  //     return res.status(500).json({ ok: false, error: "internal_error" });
  //   }
  // }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  // ---- Auth ----
  const incomingToken = readServiceToken(req);
  if (!incomingToken || !SERVICE_TOKEN || incomingToken !== SERVICE_TOKEN) {
    return res.status(401).json({
      ok: false,
      error: "Unauthorized",
      info: {
        nodeEnv: process.env.NODE_ENV || "development",
        receivedSource: incomingToken ? "provided" : "missing",
        receivedLen: (incomingToken || "").length,
        expectedLen: (SERVICE_TOKEN || "").length,
      },
    });
  }

  // ---- Parse body ----
  const body = req.body && typeof req.body === "object" ? req.body : {};
  console.log("[DEBUG][franchise-upsert] body type:", typeof req.body, "body:", body);

  const idempotencyKey = readIdempotencyKey(req);

  // Minimal required field
  const franchiseId = (body.franchiseId || "").trim();
  if (!franchiseId) {
    return res.status(400).json({ ok: false, error: "franchiseId_required" });
  }

  try {
    const db = await getDb();
    const idempCol = db.collection(IDEMPOTENCY_COLLECTION);
    const col = db.collection(COLLECTION);

    // ---- Idempotency guard ----
    if (idempotencyKey) {
      try {
        await idempCol.createIndex({ key: 1, endpoint: 1 }, { unique: true });
      } catch { }
      try {
        await idempCol.insertOne({
          key: idempotencyKey,
          endpoint: "franchise-upsert",
          createdAt: new Date(),
        });
      } catch (e) {
        // Duplicate idempotency => treat as success (no-op)
        if (e?.code === 11000) {
          return res.status(200).json({
            ok: true,
            upserted: false,
            matchedCount: 1,
            modifiedCount: 0,
            idempotent: true,
          });
        }
        throw e;
      }
    }

    // ---- Build update doc ----
    // Only set createdAt when inserting
    const now = new Date();

    // Normalize optional fields safely
    const safe = (v, def = "") => (v === undefined || v === null ? def : v);

    const updateDoc = {
      $setOnInsert: {
        createdAt: now,
      },
      $set: {
        // business attributes
        name: safe(body.name),
        email: safe(body.email),
        phone: safe(body.phone),
        whatsappNumber: safe(body.whatsappNumber),
        designation: safe(body.designation, "Franchise"),
        profilePic: safe(body.profilePic, ""),
        platform: safe(body.platform, "BBSCART"),
        zone: safe(body.zone, ""),
        stateCode: safe(body.stateCode, ""),
        cityCode: safe(body.cityCode, ""),
        businessPartnerCode: safe(body.businessPartnerCode, ""),
        bpc: safe(body.bpc, ""),
        status: safe(body.status, "active"),
        accountStatus: safe(body.accountStatus, "active"),
        active: body.active === undefined ? true : !!body.active,

        commissionRates: Array.isArray(body.commissionRates) ? body.commissionRates : [],
        commissionEarned: Number.isFinite(body.commissionEarned) ? body.commissionEarned : 0,
        commissionPending: Number.isFinite(body.commissionPending) ? body.commissionPending : 0,
        totalCustomers: Number.isFinite(body.totalCustomers) ? body.totalCustomers : 0,
        totalTransactions: Number.isFinite(body.totalTransactions) ? body.totalTransactions : 0,

        // nested (addresses / kyc / links)
        addresses: Array.isArray(body.addresses) ? body.addresses : [],
        kyc: typeof body.kyc === "object" && body.kyc ? body.kyc : {},
        links: typeof body.links === "object" && body.links ? body.links : {},

        // dates
        joinedDate: body.joinedDate ? new Date(body.joinedDate) : null,

        // always bump updatedAt
        updatedAt: now,
      },
    };

    // Ensure unique index on franchiseId
    try {
      await col.createIndex({ franchiseId: 1 }, { unique: true });
    } catch { }

    // Upsert
    console.log("[DEBUG] Payload received for franchise-upsert:", Object.keys(payload));

    const result = await col.updateOne(
      { franchiseId },
      updateDoc,
      { upsert: true }
    );

    const upserted = !!(result.upsertedId && result.upsertedId._id);

    return res.status(200).json({
      ok: true,
      upserted,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (e) {
    console.error("[franchise-upsert][POST] error:", e);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
}
