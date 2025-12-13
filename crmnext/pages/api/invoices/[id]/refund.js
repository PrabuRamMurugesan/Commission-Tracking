// import { connectDB } from "../../../../lib/mongodb";
// import { initiateRefund } from "../../../../controllers/escrowController";
// import { authMiddleware } from "../../../../middleware/authMiddleware";
// import { roleMiddleware } from "../../../../middleware/roleMiddleware";
// export default async (req, res) => {
//   await connectDB();
//   await authMiddleware(req, res);
//   await roleMiddleware(["admin", "finance"])(req, res);

//   if (req.method === "POST") {
//     return initiateRefund(req, res);
//   }
//   res.setHeader("Allow", ["POST"]);
//   res.status(405).end();
// };
