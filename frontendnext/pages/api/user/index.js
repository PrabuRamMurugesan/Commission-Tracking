// import { getAllUsers, createUser } from "../../../controllers/userController";
// import allowCors from "../../../middleware/cors";

// const handler = async (req, res) => {
//   if (req.method === "GET") return getAllUsers(req, res);
//   if (req.method === "POST") return createUser(req, res);
//   res.status(405).json({ message: "Method Not Allowed" });
// };

// export default allowCors(handler); // ✅ This is now correct
// crmnext/pages/api/users/index.js
import { getAllUsers, createUser } from "../../../controllers/userController";
import allowCors from "../../../middleware/cors";

const handler = async (req, res) => {
  console.log("🔍 Request method:", req.method);

  if (req.method === "GET") return getAllUsers(req, res);
  if (req.method === "POST") return createUser(req, res);

  return res.status(405).json({ message: "Method Not Allowed" });
};

export default allowCors(handler);

