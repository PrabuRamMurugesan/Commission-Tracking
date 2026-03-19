import fs from "fs";
import path from "path";
import allowCors from "../../../middleware/cors";
async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { path: filePath } = req.query;
    
    // Handle array of path segments
    const pathSegments = Array.isArray(filePath) ? filePath : [filePath];
    const fullPath = path.join(process.cwd(), "uploads", ...pathSegments);

    // Security check: ensure the path is within uploads directory
    const uploadsDir = path.join(process.cwd(), "uploads");
    const resolvedPath = path.resolve(fullPath);
    const resolvedUploadsDir = path.resolve(uploadsDir);

    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Get file stats
    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) {
      return res.status(404).json({ message: "Not a file" });
    }

    // Determine content type
    const ext = path.extname(fullPath).toLowerCase();
    const contentTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
    };
    const contentType = contentTypes[ext] || "application/octet-stream";

    // Set headers
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

    // Stream the file
    const fileStream = fs.createReadStream(fullPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("File serve error:", error);
    res.status(500).json({ message: "Error serving file", error: error.message });
  }
}

export default allowCors(handler);