import connectMongo from "../../../lib/mongodb";
import TierLevel from "../../../models/Commission/TierLevel";

export default async function handler(req, res) {
  await connectMongo();

  switch (req.method) {
    case "GET":
      try {
        const levels = await TierLevel.find().sort({ createdAt: -1 });
        return res.status(200).json(levels);
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }

    case "POST":
      try {
        const level = new TierLevel(req.body);
        await level.save();
        return res.status(201).json(level);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
