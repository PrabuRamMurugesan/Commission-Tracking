import connectMongo from "../../../lib/mongodb";
import EmerJobsCommissionRule from "../../../models/EmerJobsCommissionRule";

export default async function handler(req, res) {
  await connectMongo();

  switch (req.method) {
    case "GET":
      try {
        const data = await EmerJobsCommissionRule.find().sort({
          createdAt: -1,
        });
        return res.status(200).json(data);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case "POST":
      try {
        const rule = new EmerJobsCommissionRule(req.body);
        await rule.save();
        return res.status(201).json(rule);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
