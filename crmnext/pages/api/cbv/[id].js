// crmnext/pages/api/cbv/[id].js

import {
  getCbvById,
  updateCbv,
  deleteCbv,
} from "../../../controllers/Cbv/cbvController";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getCbvById(req, res);
  } else if (req.method === "PUT") {
    return updateCbv(req, res);
  } else if (req.method === "DELETE") {
    return deleteCbv(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
