// crmnext/pages/api/users/[id].js

import {
  getUserById,
  updateUserById,
  deleteUserById,
} from "../../../controllers/userController";
import allowCors from "../../../middleware/cors"; // ✅ CORS middleware

const handler = async (req, res) => {
  if (req.method === "GET") return getUserById(req, res);
  if (req.method === "PUT") return updateUserById(req, res);
  if (req.method === "DELETE") return deleteUserById(req, res);

  return res.status(405).json({ message: "Method Not Allowed" });
};

export default allowCors(handler); // ✅ Let this handle CORS & OPTIONS properly
