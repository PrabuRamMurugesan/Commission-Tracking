import connectMongo from "../../../lib/mongodb";
import AchievementCommission from "../../../models/AchievementCommission";

export default async function handler(req, res) {
  await connectMongo();
  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      try {
        const updated = await AchievementCommission.findByIdAndUpdate(
          id,
          req.body,
          { new: true }
        );
        return res.status(200).json(updated);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    case "DELETE":
      try {
        await AchievementCommission.findByIdAndDelete(id);
        return res.status(204).end();
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
