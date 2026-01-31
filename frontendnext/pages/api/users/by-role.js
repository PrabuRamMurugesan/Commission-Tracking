import dbConnect from "../../../lib/mongodb";
import Agent from "../../../models/Agent/Agent";
import Vendor from "../../../models/Vendor/Vendor";
import Cbv from "../../../models/Cbv/Cbv";
import Franchise from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
import BBSCARTUser from "../../../models/BBSCARTUser";

const FRANCHISE_SELECT =
  "_id name email phone zone platform designation franchiseeId profilePic commissionRates createdAt pan gstin district state city pincode accountStatus totalCustomers totalTransactions commissionEarned commissionPending";

export default async function handler(req, res) {
  await dbConnect();

  try {
    let franchise = await Franchise.find({}, FRANCHISE_SELECT).lean();
    // Enrich from BBSlive User (franchisee) when franchise name/email/phone are empty
    const franchiseeIds = franchise
      .filter((f) => f.franchiseeId && (!f.name || !f.email || !f.phone))
      .map((f) => f.franchiseeId);
    let userMap = {};
    if (franchiseeIds.length) {
      const users = await BBSCARTUser.find(
        { _id: { $in: franchiseeIds } },
        "name email phone"
      ).lean();
      userMap = Object.fromEntries(users.map((u) => [String(u._id), u]));
    }
    franchise = franchise.map((f) => {
      const u = f.franchiseeId ? userMap[String(f.franchiseeId)] : null;
      return {
        ...f,
        name: f.name || (u && u.name) || "-",
        email: f.email || (u && u.email) || "-",
        phone: f.phone || (u && u.phone) || "-",
      };
    });
    const agents = await Agent.find(
      {},
      "_id name email phone zone platform designation franchiseeId profilePic commissionRates createdAt"
    );
    const vendors = await Vendor.find(
      {},
      "_id name email phone zone platform designation franchiseeId profilePic commissionRates createdAt"
    );
    const cbv = await Cbv.find(
      {},
      "_id name email phone zone platform designation franchiseeId profilePic commissionRates createdAt"
    );
    const territory = await TerritoryHead.find(
      {},
      "_id name email phone zone platform designation franchiseeId profilePic commissionRates createdAt"
    );
    return res.status(200).json({
      franchise,
      agents,
      vendors,
      cbv,
      territory,
      
    });
  } catch (err) {
    console.error("Error fetching dashboard users:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
