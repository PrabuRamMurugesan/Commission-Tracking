import connectMongo from "../../../lib/mongodb";
import AchievementCommission from "../../../models/AchievementCommission";

export default async function handler(req, res) {
  await connectMongo();

  switch (req.method) {
    case "GET":
      try {
        const achievements = await AchievementCommission.find().sort({
          createdAt: -1,
        });
        return res.status(200).json(achievements);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const achievement = new AchievementCommission(req.body);
        await achievement.save();
        return res.status(201).json(achievement);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
