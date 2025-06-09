import dbConnect from "../../../lib/mongodb";
import Agent from "../../../models/Agent/Agent";
import Vendor from "../../../models/Vendor/Vendor";
import Cbv from "../../../models/Cbv/Cbv"
import Franchise from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
export default async function handler(req, res) {
  await dbConnect();

  try {
    const franchise = await Franchise.find(
      {},
      "_id name email phone zone platform designation franchiseeId profilePic commissionRates createdAt"
    );
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
