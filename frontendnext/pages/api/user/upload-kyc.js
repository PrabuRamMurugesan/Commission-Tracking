import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Vendor from "../../../models/Vendor/Vendor";
import Agent from "../../../models/Agent/Agent";
import FranchiseHead from "../../../models/Franchise/Francise";
import TerritoryHead from "../../../models/Territory/TerritoryHead";
import handleCors from "../../../lib/cors";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file upload
const uploadDir = "./uploads/kyc-documents";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "kyc-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === "application/pdf" || file.mimetype.startsWith("image/");

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"));
    }
  },
});

const uploadMiddleware = upload.single("file");

export default async function handler(req, res) {
  await handleCors(req, res);

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
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const kycDocUrl = `/uploads/kyc-documents/${req.file.filename}`;

      // Find user in User collection first
      let user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });

      if (!user) {
        // Clean up uploaded file if user not found
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ message: "User not found" });
      }

      // Add KYC document to user's kycDocs array
      if (!user.kycDocs) {
        user.kycDocs = [];
      }

      user.kycDocs.push({
        filename: req.file.originalname,
        url: kycDocUrl,
        uploadedAt: new Date(),
      });

      // Update KYC status
      user.kycStatus = "submitted";
      await user.save();

      return res.status(200).json({ 
        message: "KYC document uploaded successfully", 
        kycDocs: user.kycDocs,
        kycStatus: user.kycStatus
      });
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      console.error("KYC upload error:", error);
      return res.status(500).json({ message: "Upload failed", error: error.message });
    }
  });
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, multer will handle it
  },
};
