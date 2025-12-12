// import { connectDB } from "../../../../lib/mongodb";
// import { overrideReleaseDate } from "../../../../controllers/escrowController";
// import { authMiddleware } from "../../../../middleware/authMiddleware";
// import { roleMiddleware } from "../../../../middleware/roleMiddleware";
// import { overrideDateSchema } from "../../../../utils/escrowValidation";

// export default async (req, res) => {
//   await connectDB();
//   await authMiddleware(req, res);
//   await roleMiddleware(["admin"])(req, res);

//   if (req.method === "PUT") {
//     const { error, value } = overrideDateSchema.validate(req.body);
//     if (error)
//       return res.status(400).json({ message: error.details[0].message });
//     req.body = value;
//     return overrideReleaseDate(req, res);
//   }

//   res.setHeader("Allow", ["PUT"]);
//   res.status(405).end();
// };
