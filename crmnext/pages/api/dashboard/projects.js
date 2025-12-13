import dbConnect from "../../../utils/dbConnect";
import Project from "../../../models/Project";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const projects = await Project.find({});
      res.status(200).json({ success: true, data: projects });
    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }
}
