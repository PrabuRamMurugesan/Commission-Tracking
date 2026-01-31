// crmnext/pages/api/territory/[id].js

import {
  getTerritoryById,
  updateTerritory,
  deleteTerritory,
} from "../../../controllers/Territory/territoryHeadController";
import allowCors from "../../../middleware/cors";

const handler = async (req, res) => {
  if (req.method === "GET") {
    return getTerritoryById(req, res);
  } else if (req.method === "PUT") {
    return updateTerritory(req, res);
  } else if (req.method === "DELETE") {
    return deleteTerritory(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default allowCors(handler);
