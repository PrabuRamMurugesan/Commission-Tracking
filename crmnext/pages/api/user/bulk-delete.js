import { bulkDeleteUsers } from "../../../controllers/userController";
import allowCors from "../../../middleware/cors";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  return bulkDeleteUsers(req, res);
};

export default allowCors(handler);
