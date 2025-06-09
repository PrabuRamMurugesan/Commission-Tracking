import connectMongo from "../../lib/mongodb";
import {
  createAchievementCommission,
  getAchievementCommissions,
} from "../../controllers/commission/achievementCommissionController";
import { validateAchievementCommission } from "../../utils/achievementCommissionValidator";

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === "POST") {
    const validation = validateAchievementCommission(req.body);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }
    return createAchievementCommission(req, res);
  }

  if (req.method === "GET") {
    return getAchievementCommissions(req, res);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
