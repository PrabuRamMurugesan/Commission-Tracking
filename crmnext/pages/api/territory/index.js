// crmnext/pages/api/territory/index.js

import {
  getAllTerritory,
  createTerritory,
} from "../../../controllers/Territory/territoryHeadController";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getAllTerritory(req, res);
  } else if (req.method === "POST") {
    return createTerritory(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
