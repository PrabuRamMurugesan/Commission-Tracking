// crmnext/pages/api/franchise/[id].js

import {
  getFranciseById,
  updateFranchise,
  deleteFranchise,
} from "../../../controllers/Franchise/franchiseController";
import allowCors from "../../../middleware/cors";

const handler = async (req, res) => {
  if (req.method === "GET") {
    return getFranciseById(req, res);
  } else if (req.method === "PUT") {
    return updateFranchise(req, res);
  } else if (req.method === "DELETE") {
    return deleteFranchise(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default allowCors(handler);
