import Cors from "cors";
import dbConnect from "../../../lib/mongodb";
import Customer from "../../../models/Customer/Customer";
import Agent from "../../../models/Agent/Agent";
import Vendor from "../../../models/Vendor/Vendor";
import Cbv from "../../../models/Cbv/Cbv";
import Franchise from "../../../models/Franchise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
// 1) Set up CORS so your Vite client on 5173 can POST here
const cors = Cors({
  origin: "http://localhost:5173",
  methods: ["POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
});
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) =>
    fn(req, res, (err) => (err ? reject(err) : resolve()))
  );
}

export default async function handler(req, res) {
  await dbConnect();
  await runMiddleware(req, res, cors);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST,OPTIONS");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // 2) Pull out everything from the body, including referralId
  const {
    name,
    email,
    phone,
    whatsappNumber = "",
    password,
    platform = "BBSCART",
    zone = "",
    referralId, // ← optional ID from your form
  } = req.body;
  console.log("📥 create-customer payload:", req.body);
  console.log("🗄 building Customer.create() payload…");

  // 3) Figure out which field to set on Customer
  let agentId,franchiseId,territoryId, vendorId, cbvId;
  if (referralId) {
    if (await Agent.exists({ _id: referralId })) agentId = referralId;
    else if (await Franchise.exists({ _id: referralId })) franchiseId = referralId;
    else if (await TerritoryHead.exists({ _id: referralId })) territoryId = referralId;
    else if (await Vendor.exists({ _id: referralId })) vendorId = referralId;
    else if (await Cbv.exists({ _id: referralId })) cbvId = referralId;
  }
  console.log("📌 Referral matched as TerritoryHead:", referralId);
  // 4) Build the payload for Mongo
  const payload = {
    name,
    email,
    phone,
    whatsappNumber,
    password, // ensure you hash this in a pre-save hook or here
    platform,
    zone,
    agentId, // maybe undefined
    franchiseId,
    vendorId,
    cbvId,
    territoryId,
    joinedDate: new Date(),
  };
  console.log("📦 create payload:", payload);
  try {
    // 5) Create & return the new customer
    const customer = await Customer.create(payload);
    console.log("Resolved referral →", {
      agentId,
      franchiseId,
      vendorId,
      cbvId,
      territoryId,
    });

    return res.status(201).json({ message: "Customer created", customer });
  } catch (err) {
    console.error("Customer creation failed:", err);
    return res.status(500).json({ message: "Could not create customer" });
  }
}
