// import { connectDB } from "../../../../lib/mongodb";
// import { downloadPdf } from "../../../../controllers/escrowController";
// import { authMiddleware } from "../../../../middleware/authMiddleware";
// import { roleMiddleware } from "../../../../middleware/roleMiddleware";

// export default async (req, res) => {
//   await connectDB();
//   await authMiddleware(req, res);
//   await roleMiddleware(["admin", "finance"])(req, res);

//   if (req.method === "GET") {
//     return downloadPdf(req, res);
//   }
//   res.setHeader("Allow", ["GET"]);
//   res.status(405).end();
// };
