// import {connectDB} from "../../../lib/db";
// import { roleMiddleware } from "../../../middleware/roleMiddleware";
// import { rollbackProducts } from "../../../controllers/rollbackController";

// export default async function handler(req, res) {
//   await connectDB();
//   await roleMiddleware(req, res);

//   if (req.method === "POST") {
//     try {
//       const { rollbackType, fileName, productId } = req.body;

//       const result = await rollbackProducts({
//         rollbackType,
//         fileName,
//         productId,
//       });
//       res.status(200).json(result);
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }
