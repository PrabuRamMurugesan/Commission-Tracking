import { withCors } from "../../../lib/withCors";
import { getBBSLiveDb } from "../../../lib/db";

// future: accept JWT and derive partnerId/role from token.
// for now: partnerRole & partnerId are optional filters

async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    try {
        const db = await getBBSLiveDb();

        const {
            partnerRole,
            partnerId,
            limit = "50",
            offset = "0",
            q // text search later if needed
        } = req.query;

        // Map basic filter now; we’ll expand when hierarchy joins are ready
        const roleFilters = {
            Franchise: { "links.franchiseId": partnerId },
            TH: { "links.territoryHeadId": partnerId },
            Agent: { "links.agentId": partnerId },
            Vendor: { "links.vendorId": partnerId },
            CBAV: { "links.cbavId": partnerId },

            // For completeness (we don’t join other collections yet)
            Customer: {},       // N/A here
            Txn: {}        // N/A here
        };

        let match = {};
        if (partnerRole && partnerId && roleFilters[partnerRole]) {
            match = roleFilters[partnerRole];
        }

        const proj = {
            _id: 0,
            territoryId: 1,
            name: 1,
            email: 1,
            phone: 1,
            bpc: 1,
            businessPartnerCode: 1,
            platform: 1,
            zone: 1,
            accountStatus: 1,
            totalCustomers: 1,
            totalTransactions: 1,
            commissionEarned: 1,
            commissionPending: 1,
            joinedDate: 1
        };

        const items = await db.collection("territoryheads")
            .find(match, { projection: proj })
            .skip(parseInt(offset, 10))
            .limit(parseInt(limit, 10))
            .sort({ joinedDate: -1, name: 1 })
            .toArray();

        // column mapping for UI convenience
        const mapped = items.map(it => ({
            name: it.name ?? "",
            email: it.email ?? "",
            bpc: it.bpc ?? it.businessPartnerCode ?? "",
            phone: it.phone ?? "",
            platform: it.platform ?? "BBSCART",
            zone: it.zone ?? "",
            status: it.accountStatus ?? "active",
            customers: it.totalCustomers ?? 0,
            transactions: it.totalTransactions ?? 0,
            earned: it.commissionEarned ?? 0,
            pending: it.commissionPending ?? 0,
            joinedDate: it.joinedDate ?? null,
            territoryId: it.territoryId ?? ""
        }));

        return res.status(200).json({ ok: true, count: mapped.length, items: mapped });
    } catch (e) {
        console.error("[dashboard/territories][GET] error:", e);
        return res.status(500).json({ ok: false, error: "internal_error" });
    }
}

export default withCors(handler);
