// crmnext/pages/api/agents/[id].js

import {
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../../../controllers/Customer/agentController";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getCustomerById(req, res);
  } else if (req.method === "PUT") {
    return updateCustomer(req, res);
  } else if (req.method === "DELETE") {
    return deleteCustomer(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
