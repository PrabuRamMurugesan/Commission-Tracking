import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Vendor from "../../../models/Vendor/Vendor";
import Agent from "../../../models/Agent/Agent";
import FranchiseHead from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
import allowCors from "../../../middleware/cors";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file upload
const uploadDir = "./uploads/profile-images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Disable multer's default error handling
const uploadMiddleware = upload.single("file");

async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await dbConnect();

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { email } = req.body;

    if (!email) {
      // Clean up uploaded file if email is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      // Use API route to serve the image
      const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
      const relativePath = `/uploads/profile-images/${req.file.filename}`;
      const profileImageUrl = `${baseUrl}/api/uploads/profile-images/${req.file.filename}`;

      // Find user in User collection first
      let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });

      if (!user) {
        // Check Vendor collection
        const vendor = await Vendor.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
        if (vendor) {
          vendor.profilePic = relativePath;
          await vendor.save();
          return res.status(200).json({ 
            message: "Profile image uploaded successfully", 
            profileImage: profileImageUrl,
            profileImageRelative: relativePath
          });
        }

        // Check Agent collection
        const agent = await Agent.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
        if (agent) {
          agent.profilePic = relativePath;
          await agent.save();
          return res.status(200).json({ 
            message: "Profile image uploaded successfully", 
            profileImage: profileImageUrl,
            profileImageRelative: relativePath
          });
        }

        // Check FranchiseHead collection
        const franchise = await FranchiseHead.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
        if (franchise) {
          franchise.profilePic = relativePath;
          await franchise.save();
          return res.status(200).json({ 
            message: "Profile image uploaded successfully", 
            profileImage: profileImageUrl,
            profileImageRelative: relativePath
          });
        }

        // Check TerritoryHead collection
        const territory = await TerritoryHead.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
        if (territory) {
          territory.profilePic = relativePath;
          await territory.save();
          return res.status(200).json({ 
            message: "Profile image uploaded successfully", 
            profileImage: profileImageUrl,
            profileImageRelative: relativePath
          });
        }

        // Clean up uploaded file if user not found
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "User not found" });
      }

      // Update User collection
      user.profileImage = relativePath;
      await user.save();

      return res.status(200).json({ 
        message: "Profile image uploaded successfully", 
        profileImage: profileImageUrl,
        profileImageRelative: relativePath
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Profile image upload error:", error);
      return res.status(500).json({ message: "Upload failed", error: error.message });
    }
  });
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, multer will handle it
  },
};

export default allowCors(handler);