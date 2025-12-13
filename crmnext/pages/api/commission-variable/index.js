import connectMongo from "../../../lib/mongodb";
import CommissionVariableRule from "../../../models/CommissionVariableRule";

export default async function handler(req, res) {
  await connectMongo();

  switch (req.method) {
    case "GET":
      const rules = await CommissionVariableRule.find();
      return res.status(200).json(rules);

    case "POST":
      try {
        const rule = new CommissionVariableRule(req.body);
        await rule.save();
        return res.status(201).json(rule);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }

    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
