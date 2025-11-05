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


// pages/api/ingest/territory-upsert.js Commented by bbson 31 oct 2025 11:40hrs
// import withCors from "../../../lib/withCors";
// import { verifyAuth } from "../../../lib/crmSecurity";
// import { checkIdempotency, writeIdempotency } from "../../../lib/idempotencyService";
// import { getBBSLiveDb, getCollection } from "../../../lib/db"; // your existing commissioncrm connection
// // 👉 write to BBSlive
// //  import TerritoryHead from "../../../models/bbslive/TerritoryHead";       // ✅ BBSlive model
// // (Optional) lightweight mirror for CRM lists, if you still use them:
// import mongoose from "mongoose";

// // Use native Mongo driver via your existing lib/db helpers.
// async function TerritoryHeadModel() {
//   return await getCollection("territoryheads");
// }


// const MirrorSchema = new mongoose.Schema(
//   {
//     territoryId: { type: String, index: true },
//     name: String,
//     email: String,
//     phone: String,
//     bpc: String,
//     platform: String,
//     zone: String,
//     accountStatus: String,
//     approved_at: Date,
//   },
//   { timestamps: true, strict: false, collection: "territories" }
// );
// async function TerritoryMirror() {
//   // await connectDB(); // commissioncrm
//  await getBBSliveDb();                // ✅ correct for BBSlive writes
//   return mongoose.models.TerritoryMirror || mongoose.model("TerritoryMirror", MirrorSchema);
// }

// async function handler(req, res) {

//   // === NEW: GET (List Territory Heads) ===
// if (req.method === "GET") {
//   try {
//     // Optional partner scoping from headers (works for embedded BBSCART calls)
//     const partnerId   = req.headers["x-partner-id"];
//     const partnerRole = req.headers["x-partner-role"];

//     // Role → filter mapping (includes Customer & Transaction for consistency)
//     // Note: For a TerritoryHeads list, Customer/Transaction won’t usually match anything
//     // unless you store such links in TH docs. They are included to satisfy uniform header use.
//     const roleFilters = {
//       Franchise:   { "links.franchiseId": partnerId },
//       TH:          { "links.territoryHeadId": partnerId },
//       Agent:       { "links.agentId": partnerId },
//       Vendor:      { "links.vendorId": partnerId },
//       CBAV:        { "links.cbavId": partnerId },
//       Customer:    { "links.customerId": partnerId },             // included per request
//       Transaction: { "links.transactionPartyIds": partnerId },    // included per request
//     };

//     const filter =
//       partnerId && partnerRole && roleFilters[partnerRole]
//         ? roleFilters[partnerRole]
//         : {};

//     const Territory = await TerritoryHeadModel();

//     // Project the full set of attributes you asked to see during smoke tests.
//     // (Fields align with your CRM territory JSON; extra/unknown keys will be returned if present.)
//     const projection = {
//       territoryId: 1,
//       name: 1,
//       email: 1,
//       phone: 1,
//       whatsappNumber: 1,
//       businessPartnerCode: 1,
//       bpc: 1,
//       platform: 1,
//       zone: 1,
//       stateCode: 1,
//       cityCode: 1,
//       accountStatus: 1,
//       status: 1,
//       designation: 1,
//       joinedDate: 1,
//       commissionEarned: 1,
//       commissionPending: 1,
//       commissionRates: 1,
//       totalCustomers: 1,
//       totalTransactions: 1,
//       addresses: 1,
//       kyc: 1,
//       links: 1,
//       createdAt: 1,
//       updatedAt: 1,
//     };

//     // Using native driver via collection handle
//     const items = await Territory.find(filter, { projection })
//       .sort({ joinedDate: -1, createdAt: -1 })
//       .limit(500)
//       .toArray();

//     return res.status(200).json({ ok: true, count: items.length, items });
//   } catch (e) {
//     console.error("[territory-upsert GET] error:", e);
//     return res.status(500).json({ ok: false, error: "internal_error" });
//   }
// }
// // === END GET (List) ===

// const now = new Date();
// if (!b.createdAt) b.createdAt = now;
// b.updatedAt = now;


//   if (req.method !== "POST") {
//     return res.status(405).json({ ok: false, error: "method_not_allowed" });
//   }

//   // 1) Auth + Idempotency
//   try {
//     verifyAuth(req); // Authorization: Bearer <SERVICE_TOKEN>
//   } catch (e) {
//     return res.status(401).json({ ok: false, error: "unauthorized", details: e.message });
//   }

//   const idemKey = req.headers["x-idempotency-key"];
//   if (!idemKey) return res.status(400).json({ ok: false, error: "idempotency_required" });

//   const already = await checkIdempotency(idemKey);
//   if (already) return res.json({ ok: false, dedup: true });

//   const b = req.body || {};

//   // 2) Basic validation (keep loose—BBSlive is source of truth for full profile)
//   if (!b.territoryId || !b.name || !b.email) {
//     return res.status(400).json({ ok: false, error: "missing_fields", fields: ["territoryId","name","email"] });
//   }

//   // Normalize status/approved date fields
//   const core = {
//     territoryId: String(b.territoryId).trim(),
//     name: String(b.name).trim(),
//     email: String(b.email).trim(),
//     phone: b.phone ? String(b.phone).trim() : undefined,
//     whatsappNumber: b.whatsappNumber ? String(b.whatsappNumber).trim() : undefined,
//     bpc: b.bpc ? String(b.bpc).trim() : undefined,
//     platform: b.platform ? String(b.platform).trim() : "BBSCART",
//     zone: b.zone ? String(b.zone).trim() : undefined,
//     stateCode: b.stateCode ? String(b.stateCode).trim() : undefined,
//     cityCode: b.cityCode ? String(b.cityCode).trim() : undefined,
//     accountStatus: b.accountStatus ? String(b.accountStatus).trim() : "active",
//     approved_at: b.approved_at ? new Date(b.approved_at) : undefined,
//   };

//   // 3) Upsert into BBSlive.territoryheads (full profile allowed)
//   try {
//     const Territory = await TerritoryHeadModel();
//     const result = await Territory.updateOne(
//       { territoryId: core.territoryId },
//       {
//         $set: { ...core },
//         // Everything else—including your large address, KYC, GST blocks—flows as “profile”
//         $setOnInsert: { createdAt: new Date() },
//         $push: {},
//         $addToSet: {},
//         ...(b.profile ? { $set: { profile: b.profile } } : {}), // optional bundle
//         ...(b.register_business_address
//           ? { $set: { register_business_address: b.register_business_address } }
//           : {}),
//         ...(b.gst_address ? { $set: { gst_address: b.gst_address } } : {}),
//       },
//       { upsert: true }
//     );

//     // 4) (Optional) mirror slim row in commissioncrm.territories so your CRM list loads instantly
//     try {
//       const Mirror = await TerritoryMirror();
//       await Mirror.updateOne(
//         { territoryId: core.territoryId },
//         { $set: core },
//         { upsert: true }
//       );
//     } catch (e) {
//       // Non-fatal: lists can also read directly from BBSlive via API if preferred
//       console.warn("[mirror] write skipped:", e.message);
//     }

//     // 5) Record idempotency last
//     await writeIdempotency(idemKey, { scope: "territory-upsert", ref: core.territoryId });

//     return res.json({
//       ok: true,
//       upserted: !!result.upsertedId || result.modifiedCount || result.matchedCount,
//       territoryId: core.territoryId,
//     });
//   } catch (e) {
//     console.error("territory-upsert error:", e);
//     return res.status(500).json({ ok: false, error: "write_failed", details: e.message });
//   }
// }

// export default withCors(handler);


// pages/api/ingest/territory-upsert.js

// pages/api/ingest/territory-upsert.js
// Complete route: GET (list) + POST (upsert) with robust auth + idempotency

import { withCors } from "../../../lib/withCors";
import { getCollection } from "../../../lib/db";

/** Helpers */
function badRequest(res, msg) {
  return res.status(400).json({ ok: false, error: msg });
}
function unauthorized(res, msg = "Unauthorized") {
  return res.status(401).json({ ok: false, error: msg });
}

/** Core handler */
async function handler(req, res) {
  /** ---------------------------
   *  GET  /api/ingest/territory-upsert
   *  Lists Territory Heads (embed for dashboards)
   *  --------------------------- */
  if (req.method === "GET") {
    try {
      const partnerId = req.headers["x-partner-id"];
      const partnerRole = req.headers["x-partner-role"];

      // Basic role filter (refine later as hierarchy links grow)
      const roleFilters = {
        Franchise: { "links.franchiseId": partnerId },
        TH: { "links.territoryHeadId": partnerId },
        Agent: { "links.agentId": partnerId },
        Vendor: { "links.vendorId": partnerId },
        CBAV: { "links.cbavId": partnerId },
        Customer: { "links.customerId": partnerId },
        Transaction: { "links.transactionPartyIds": partnerId },
      };

      const filter =
        partnerId && partnerRole && roleFilters[partnerRole]
          ? roleFilters[partnerRole]
          : {};

      const col = await getCollection("territoryheads");

      // Return a useful projection (omit to return full docs)
      const projection = {
        territoryId: 1,
        name: 1,
        email: 1,
        phone: 1,
        whatsappNumber: 1,
        platform: 1,
        zone: 1,
        stateCode: 1,
        cityCode: 1,
        businessPartnerCode: 1,
        bpc: 1,
        accountStatus: 1,
        status: 1,
        designation: 1,
        commissionEarned: 1,
        commissionPending: 1,
        commissionRates: 1,
        totalCustomers: 1,
        totalTransactions: 1,
        addresses: 1,
        kyc: 1,
        links: 1,
        franchiseeId: 1,
        joinedDate: 1,
        createdAt: 1,
        updatedAt: 1,
      };

      const items = await col
        .find(filter)
        .sort({ joinedDate: -1, createdAt: -1 })
        .limit(500)
        .toArray();

      return res.status(200).json({ ok: true, count: items.length, items });
    } catch (e) {
      console.error("[territory-upsert][GET] error:", e);
      return res.status(500).json({ ok: false, error: "internal_error" });
    }
  }

  /** ---------------------------
   *  POST /api/ingest/territory-upsert
   *  Upsert a Territory Head
   *  --------------------------- */
  if (req.method === "POST") {
    try {
      // ==== AUTH (robust; multi-source; trimmed) ====
      const authHeader = req.headers.authorization || "";
      const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
      const fromAuthHeader = bearerMatch ? bearerMatch[1] : "";

      const fromXHeader = (req.headers["x-service-token"] || "").toString();
      const fromQuery = (req.query?.token || "").toString(); // dev-only
      let fromBodyToken = "";
      try {
        const maybe = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        fromBodyToken = (maybe?.serviceToken || "").toString();
      } catch { }

      const receivedCandidates = [
        fromAuthHeader,
        fromXHeader,
        fromBodyToken,
        process.env.NODE_ENV !== "production" ? fromQuery : ""
      ];
      const received = (receivedCandidates.find(t => (t || "").trim().length > 0) || "").trim();

      // Accept either env key name so BBSCART/CRM can share one
      const expected = (
        (process.env.SERVICE_TOKEN || process.env.CRM_SERVICE_TOKEN || "")
      ).trim();

      if (!expected) {
        console.error("[AUTH] Missing SERVICE_TOKEN/CRM_SERVICE_TOKEN in env");
        return res.status(500).json({ ok: false, error: "server_token_not_configured" });
      }
      if (!received || received !== expected) {
        const source =
          received === fromAuthHeader.trim() ? "Authorization.Bearer" :
            received === fromXHeader.trim() ? "X-Service-Token" :
              received === fromBodyToken.trim() ? "body.serviceToken" :
                received === fromQuery.trim() ? "query.token" :
                  "none";
        return res.status(401).json({
          ok: false,
          error: "Unauthorized",
          info: {
            nodeEnv: process.env.NODE_ENV,
            receivedSource: source,
            receivedLen: received ? received.length : 0,
            expectedLen: expected.length
          }
        });
      }
      // ==== END AUTH ====

      // ==== Idempotency (simple store in BBSlive.idempotency_keys) ====
      const idemKey = (req.headers["x-idempotency-key"] || "").toString().trim();
      if (!idemKey) return badRequest(res, "Missing X-Idempotency-Key");

      const idemCol = await getCollection("idempotency_keys");
      const existingIdem = await idemCol.findOne({ key: idemKey });
      if (existingIdem) {
        // return last known result quickly (idempotent behaviour)
        return res.status(200).json(existingIdem.result || { ok: true, idempotent: true });
      }
      // ==== END Idempotency ====

      // Parse body safely (PowerShell sometimes sends as string)
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || !body.territoryId) {
        return badRequest(res, "territoryId is required");
      }

      const now = new Date();

      // const doc = {
      //   territoryId: body.territoryId,

      //   // Identity / profile
      //   name: body.name,
      //   email: body.email,
      //   phone: body.phone,
      //   whatsappNumber: body.whatsappNumber,
      //   designation: body.designation,
      //   profilePic: body.profilePic,

      //   // Org / geo
      //   platform: body.platform,
      //   zone: body.zone,
      //   stateCode: body.stateCode,
      //   cityCode: body.cityCode,

      //   // Codes
      //   businessPartnerCode: body.businessPartnerCode,
      //   bpc: body.bpc,

      //   // Status
      //   status: body.status || undefined,
      //   accountStatus: body.accountStatus || undefined,
      //   active: body.active ?? true,

      //   // Commissions / tallies
      //   commissionRates: body.commissionRates,
      //   commissionEarned: body.commissionEarned ?? 0,
      //   commissionPending: body.commissionPending ?? 0,
      //   totalCustomers: body.totalCustomers ?? 0,
      //   totalTransactions: body.totalTransactions ?? 0,

      //   // KYC / address
      //   kyc: body.kyc,
      //   addresses: body.addresses,

      //   // Links / hierarchy
      //   links: body.links,
      //   franchiseeId: body.franchiseeId,

      //   // Dates
      //   joinedDate: body.joinedDate ? new Date(body.joinedDate) : undefined,
      //   updatedAt: now,
      // };


      // - 161–205  (DELETE the whole existing const doc = { ... } block)
  
      const doc = {
    // First, keep ALL incoming keys from BBSCART/clients
    ...body,
   // Ensure required id stays correct (do not rely on spread order)
   territoryId: body.territoryId,

    // Identity / profile (explicitly kept; spread above already included them)
    name: body.name,
    email: body.email,
    phone: body.phone,
   whatsappNumber: body.whatsappNumber,
   designation: body.designation,
   profilePic: body.profilePic,

   // Org / geo
    platform: body.platform,
    zone: body.zone,
    stateCode: body.stateCode,
   cityCode: body.cityCode,

   // Codes    businessPartnerCode: body.businessPartnerCode,
   bpc: body.bpc,

   // Status
   status: body.status || undefined,
    accountStatus: body.accountStatus || undefined,
    active: body.active ?? true,

    // Commissions / tallies
    commissionRates: body.commissionRates,
   commissionEarned: body.commissionEarned ?? 0,
    commissionPending: body.commissionPending ?? 0,
    totalCustomers: body.totalCustomers ?? 0,
    totalTransactions: body.totalTransactions ?? 0,

    // KYC / address
    kyc: body.kyc,
    addresses: body.addresses,

    // Links / hierarchy (fallback to empty object when absent)
   links: body.links || {},
    franchiseeId: body.franchiseeId,

    // Dates — normalize joinedDate with safe fallbacks
    joinedDate: body.joinedDate
      ? new Date(body.joinedDate)
      : (body.createdAt
          ? new Date(body.createdAt)
        : (body.submitted_at ? new Date(body.submitted_at) : undefined)),

    // Always refresh updatedAt on write
    updatedAt: now,
  };




      if (!body.createdAt) {
        doc.createdAt = now;
      }

  // Upsert into BBSlive.territoryheads (avoid setting createdAt in $set)
const thCol = await getCollection("territoryheads");

// remove createdAt from $set; only use it in $setOnInsert
const { createdAt, ...toSet } = doc;
const update = {
  $set: toSet,
  $setOnInsert: { createdAt: createdAt ?? now }
};

const result = await thCol.updateOne(
  { territoryId: body.territoryId },
  update,
  { upsert: true }
);

      const responsePayload = {
        ok: true,
        upserted: !!result.upsertedId,
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      };

      // persist idempotency result
      await idemCol.insertOne({
        key: idemKey,
        createdAt: now,
        result: responsePayload
      });

      return res.status(200).json(responsePayload);
    } catch (e) {
      console.error("[territory-upsert][POST] error:", e.stack || e);
      console.log("[DEBUG] error object:", JSON.stringify(e, Object.getOwnPropertyNames(e)));

      return res.status(500).json({ ok: false, error: "internal_error" });
    }
  }

  /** Other verbs */
  return res.status(405).json({ ok: false, error: "Method Not Allowed" });
}

export default withCors(handler);
