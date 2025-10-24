import { connectDB } from "../../../lib/db";
import { handleAdminUpload } from "../../../controllers/adminUploadController";

export const config = {
  api: {
    bodyParser: false, // Required to handle file manually
  },
};

export default async function handler(req, res) {
  // ✅ Connect to DB
  await connectDB();

  // ✅ Set CORS headers for ALL requests
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5174"); // ✅ Frontend origin
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ✅ Handle POST upload
  if (req.method === "POST") {
    try {
      const data = await handleAdminUpload(req); // Reads file and uploads
      return res.status(200).json({
        success: true,
        message: "Upload processed successfully.",
        ...data,
      });
    } catch (err) {
      console.error("Upload handler error:", err);
      return res.status(500).json({
        success: false,
        message: err.message || "Unknown error",
      });
    }
  }

  // ✅ Fallback for other methods
  return res.status(405).json({ message: "Method Not Allowed" });
}
