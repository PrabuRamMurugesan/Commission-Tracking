// crmnext/pages/api/franchise/index.js

import {
  getAllFranchises,
  createFranchise,
} from "../../../controllers/Franchise/franchiseController";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getAllFranchises(req, res);
  } else if (req.method === "POST") {
    return createFranchise(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
