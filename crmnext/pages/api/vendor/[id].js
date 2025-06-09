// crmnext/pages/api/vendor/[id].js

import {
  getVendorById,
  updateVendor,
  deleteVendor,
} from "../../../controllers/Vendor/vendorController";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getVendorById(req, res);
  } else if (req.method === "PUT") {
    return updateVendor(req, res);
  } else if (req.method === "DELETE") {
    return deleteVendor(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
