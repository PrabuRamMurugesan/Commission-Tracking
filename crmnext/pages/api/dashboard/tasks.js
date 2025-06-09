import dbConnect from "../../../utils/dbConnect";
import Task from "../../../models/Task";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const tasks = await Task.find({});
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
