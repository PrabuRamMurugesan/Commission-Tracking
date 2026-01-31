import connectMongo from "../../../lib/mongodb";
import TierLevel from "../../../models/Commission/TierLevel";

export default async function handler(req, res) {
  await connectMongo();
  const { id } = req.query;

  switch (req.method) {
    case "PUT":
      try {
        const updated = await TierLevel.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        return res.status(200).json(updated);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }

    case "DELETE":
      try {
        await TierLevel.findByIdAndDelete(id);
        return res.status(204).end();
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
