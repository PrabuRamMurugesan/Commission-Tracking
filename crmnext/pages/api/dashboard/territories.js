// // import { withCors } from "../../../lib/withCors";
// // import { getBBSLiveDb } from "../../../lib/db";

// // // future: accept JWT and derive partnerId/role from token.
// // // for now: partnerRole & partnerId are optional filters

// // async function handler(req, res) {
// //     if (req.method !== "GET") {
// //         return res.status(405).json({ ok: false, error: "Method Not Allowed" });
// //     }

// //     try {
// //         const db = await getBBSLiveDb();

// //         const {
// //             partnerRole,
// //             partnerId,
// //             limit = "50",
// //             offset = "0",
// //             q // text search later if needed
// //         } = req.query;

// //         // Map basic filter now; we’ll expand when hierarchy joins are ready
// //         const roleFilters = {
// //             Franchise: { "links.franchiseId": partnerId },
// //             TH: { "links.territoryHeadId": partnerId },
// //             Agent: { "links.agentId": partnerId },
// //             Vendor: { "links.vendorId": partnerId },
// //             CBAV: { "links.cbavId": partnerId },

// //             // For completeness (we don’t join other collections yet)
// //             Customer: {},       // N/A here
// //             Txn: {}        // N/A here
// //         };

// //         let match = {};
// //         if (partnerRole && partnerId && roleFilters[partnerRole]) {
// //             match = roleFilters[partnerRole];
// //         }

// //         const proj = {
// //             _id: 0,
// //             territoryId: 1,
// //             name: 1,
// //             email: 1,
// //             phone: 1,
// //             bpc: 1,
// //             businessPartnerCode: 1,
// //             platform: 1,
// //             zone: 1,
// //             accountStatus: 1,
// //             totalCustomers: 1,
// //             totalTransactions: 1,
// //             commissionEarned: 1,
// //             commissionPending: 1,
// //             joinedDate: 1
// //         };

// //         const items = await db.collection("territoryheads")
// //             .find(match, { projection: proj })
// //             .skip(parseInt(offset, 10))
// //             .limit(parseInt(limit, 10))
// //             .sort({ joinedDate: -1, name: 1 })
// //             .toArray();

// //         // column mapping for UI convenience
// //         const mapped = items.map(it => ({
// //             name: it.name ?? "",
// //             email: it.email ?? "",
// //             bpc: it.bpc ?? it.businessPartnerCode ?? "",
// //             phone: it.phone ?? "",
// //             platform: it.platform ?? "BBSCART",
// //             zone: it.zone ?? "",
// //             status: it.accountStatus ?? "active",
// //             customers: it.totalCustomers ?? 0,
// //             transactions: it.totalTransactions ?? 0,
// //             earned: it.commissionEarned ?? 0,
// //             pending: it.commissionPending ?? 0,
// //             joinedDate: it.joinedDate ?? null,
// //             territoryId: it.territoryId ?? ""
// //         }));

// //         return res.status(200).json({ ok: true, count: mapped.length, items: mapped });
// //     } catch (e) {
// //         console.error("[dashboard/territories][GET] error:", e);
// //         return res.status(500).json({ ok: false, error: "internal_error" });
// //     }
// // }

// // export default withCors(handler);


// // pages/api/dashboard/territories.js
// import { withCors } from "../../../lib/withCors";
// import { getBBSLiveDb } from "../../../lib/db";

// // tiny helpers
// const coalesce = (...vals) => {
//   for (const v of vals) if (v !== null && v !== undefined && v !== "") return v;
//   return undefined;
// };
// const toDateOrNull = (v) => {
//   if (!v) return null;
//   const d = new Date(v);
//   return isNaN(d.getTime()) ? null : d;
// };

// function normalize(doc) {
//   // name: explicit name OR vendor form fields
//   const name = coalesce(
//     doc.name,
//     [doc.vendor_fname, doc.vendor_lname].filter(Boolean).join(" ").trim()
//   );

//   // phone: any of these
//   const phone = coalesce(doc.phone, doc.whatsappNumber, doc.outlet_contact_no);

//   // platform: default to BBSCART if missing
//   const platform = coalesce(doc.platform, "BBSCART");

//   // zone: prefer explicit zone, else stateCode
//   const zone = coalesce(doc.zone, doc.stateCode);

//   // status from several shapes
//   const status =
//     coalesce(
//       doc.status,
//       doc.accountStatus,
//       doc.application_status === "approved" ? "active" : undefined,
//       doc.is_active === true ? "active" : doc.is_active === false ? "inactive" : undefined
//     ) || "pending";

//   // joined date fallback chain
//   const joinedRaw = coalesce(doc.joinedDate, doc.createdAt, doc.submitted_at);
//   const joined = toDateOrNull(joinedRaw);

//   return {
//     _id: String(doc._id || ""),
//     territoryId: coalesce(doc.territoryId, doc?.links?.territoryHeadId, ""),
//     name: name || "",
//     email: doc.email || "",
//     bpc: coalesce(doc.bpc, doc.businessPartnerCode, ""),
//     phone: phone || "",
//     platform,
//     zone: zone || "",
//     status,
//     customers: Number(doc.totalCustomers || 0),
//     transactions: Number(doc.totalTransactions || 0),
//     earned: Number(doc.commissionEarned || 0),
//     pending: Number(doc.commissionPending || 0),
//     joined, // Date object; frontend should format
//   };
// }

// async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ ok: false, error: "Method Not Allowed" });
//   }

//   try {
//     const db = await getBBSLiveDb();

//     const {
//       partnerRole,
//       partnerId,
//       limit = "100",
//       offset = "0",
//       q,
//       platform,
//       status,
//       zone,
//     } = req.query;

//     // Base match: optional partner scoping (kept simple for now)
//     const roleFilters = {
//       Franchise: { "links.franchiseId": partnerId },
//       TH: { "links.territoryHeadId": partnerId },
//       Agent: { "links.agentId": partnerId },
//       Vendor: { "links.vendorId": partnerId },
//       CBAV: { "links.cbavId": partnerId },
//     };
//     let match = {};
//     if (partnerRole && partnerId && roleFilters[partnerRole]) match = roleFilters[partnerRole];

//     // Optional filters
//     if (platform) match.$or = [{ platform }, { platform: { $exists: false } }];
//     if (status) match.$or = [{ status }, { accountStatus: status }]; // tolerate both keys
//     if (zone) match.$or = [{ zone }, { stateCode: zone }];

//     // Text search (very light)
//     if (q && String(q).trim()) {
//       const rx = new RegExp(String(q).trim(), "i");
//       match.$or = [
//         ...(match.$or || []),
//         { name: rx },
//         { email: rx },
//         { phone: rx },
//         { bpc: rx },
//         { businessPartnerCode: rx },
//         { vendor_fname: rx },
//         { vendor_lname: rx },
//       ];
//     }

//     // Project a superset so we can normalize both shapes
//     const proj = {
//       territoryId: 1,
//       name: 1,
//       email: 1,
//       phone: 1,
//       bpc: 1,
//       businessPartnerCode: 1,
//       platform: 1,
//       zone: 1,
//       stateCode: 1,
//       status: 1,
//       accountStatus: 1,
//       totalCustomers: 1,
//       totalTransactions: 1,
//       commissionEarned: 1,
//       commissionPending: 1,
//       joinedDate: 1,
//       createdAt: 1,
//       submitted_at: 1,

//       // BBSCART-form shape fields
//       vendor_fname: 1,
//       vendor_lname: 1,
//       whatsappNumber: 1,
//       outlet_contact_no: 1,
//       application_status: 1,
//       is_active: 1,
//       links: 1,
//     };

//     const items = await db
//       .collection("territoryheads")
//       .find(match, { projection: proj })
//       .skip(parseInt(offset, 10))
//       .limit(parseInt(limit, 10))
//       .sort({ joinedDate: -1, createdAt: -1, submitted_at: -1, name: 1 })
//       .toArray();

//     const rows = items.map(normalize);
//     return res.status(200).json({ ok: true, count: rows.length, items: rows });
//   } catch (e) {
//     console.error("[dashboard/territories][GET] error:", e);
//     return res.status(500).json({ ok: false, error: "internal_error" });
//   }
// }

// export default withCors(handler);


// pages/api/dashboard/territories.js
// import { getBBSliveDb } from "../../../bbsliveDb.js";
import { getBBSliveDb,} from "../../../lib/db";

// helpers
const coalesce = (...vals) => {
  for (const v of vals) if (v !== null && v !== undefined && v !== "") return v;
  return undefined;
};
const toDateOrNull = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

function normalize(doc) {
  const name = coalesce(doc.name, [doc.vendor_fname, doc.vendor_lname].filter(Boolean).join(" ").trim());
  const phone = coalesce(doc.phone, doc.whatsappNumber, doc.outlet_contact_no);
  const platform = coalesce(doc.platform, "BBSCART");
  const zone = coalesce(doc.zone, doc.stateCode);
  const status =
    coalesce(
      doc.status,
      doc.accountStatus,
      doc.application_status === "approved" ? "active" : undefined,
      doc.is_active === true ? "active" : (doc.is_active === false ? "inactive" : undefined)
    ) || "pending";
  const joinedRaw = coalesce(doc.joinedDate, doc.createdAt, doc.submitted_at);
  const joined = toDateOrNull(joinedRaw);

  return {
    _id: String(doc._id || ""),
    territoryId: coalesce(doc.territoryId, doc?.links?.territoryHeadId, ""),
    name: name || "",
    email: doc.email || "",
    bpc: coalesce(doc.bpc, doc.businessPartnerCode, ""),
    phone: phone || "",
    platform,
    zone: zone || "",
    status,
    customers: Number(doc.totalCustomers || 0),
    transactions: Number(doc.totalTransactions || 0),
    earned: Number(doc.commissionEarned || 0),
    pending: Number(doc.commissionPending || 0),
    joined, // Date object
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // const conn = await getBBSliveDb();
    // const db = conn.getCollection().db();
  // getBBSliveDb() in your lib/db.js returns either:
 //   A) a DB instance, or
 //   B) a client where you must call .db()
 const conn = await getBBSliveDb();
  const db = typeof conn.db === "function" ? conn.db() : conn;
  
    const {
      partnerRole,
      partnerId,
      limit = "100",
      offset = "0",
      q,
      platform,
      status,
      zone,
    } = req.query;

    // Optional hierarchical scoping (kept simple)
    const roleFilters = {
      Franchise: { "links.franchiseId": partnerId },
      TH: { "links.territoryHeadId": partnerId },
      Agent: { "links.agentId": partnerId },
      Vendor: { "links.vendorId": partnerId },
      CBAV: { "links.cbavId": partnerId },
    };
    let match = {};
    if (partnerRole && partnerId && roleFilters[partnerRole]) match = roleFilters[partnerRole];

    // Optional filters
    if (platform) match.$or = [{ platform }, { platform: { $exists: false } }];
    if (status)  match.$or = [...(match.$or || []), { status }, { accountStatus: status }];
    if (zone)    match.$or = [...(match.$or || []), { zone }, { stateCode: zone }];

    if (q && String(q).trim()) {
      const rx = new RegExp(String(q).trim(), "i");
      match.$or = [
        ...(match.$or || []),
        { name: rx }, { email: rx }, { phone: rx },
        { bpc: rx }, { businessPartnerCode: rx },
        { vendor_fname: rx }, { vendor_lname: rx },
      ];
    }

    const proj = {
      territoryId: 1, name: 1, email: 1, phone: 1, bpc: 1, businessPartnerCode: 1,
      platform: 1, zone: 1, stateCode: 1, status: 1, accountStatus: 1,
      totalCustomers: 1, totalTransactions: 1, commissionEarned: 1, commissionPending: 1,
      joinedDate: 1, createdAt: 1, submitted_at: 1,
      vendor_fname: 1, vendor_lname: 1, whatsappNumber: 1, outlet_contact_no: 1,
      application_status: 1, is_active: 1, links: 1,
    };

    const raw = await db.collection("territoryheads")
      .find(match, { projection: proj })
      .skip(parseInt(offset, 10))
      .limit(parseInt(limit, 10))
      .sort({ joinedDate: -1, createdAt: -1, submitted_at: -1, name: 1 })
      .toArray();

    const items = raw.map(normalize);
    return res.status(200).json({ ok: true, count: items.length, items });
  } catch (e) {
    console.error("[dashboard/territories] error:", e);
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
}
