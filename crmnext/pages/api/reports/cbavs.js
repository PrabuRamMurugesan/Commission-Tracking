// pages/api/reports/cbavs.js

import dbConnect from "../../../lib/mongodb";
import CustomerBecomeVendor from "../../../models/CBAVReport";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const { fromDate, toDate, search } = req.query;

      let query = {};

      if (fromDate && toDate) {
        query.createdAt = {
          $gte: new Date(fromDate),
          $lte: new Date(toDate),
        };
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      const cbavs = await CustomerBecomeVendor.find(query).sort({
        createdAt: -1,
      });

      res.status(200).json({ success: true, data: cbavs });
    } catch (error) {
      console.error("CBAV Fetch Error:", error);
      res.status(500).json({ success: false, error: "Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
