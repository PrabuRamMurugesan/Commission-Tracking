// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/healthcare folder exists
const uploadDir = "./uploads/healthcare";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Allowed file types
const allowedImage = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const allowedDoc = ["application/pdf"];

const allowedFields = [
  "profilePhoto",
  "registrationDoc",
  "clinicCertificate",
  "idProof",
  "aadhaarDocumentUrl",
];

const fileFilter = (req, file, cb) => {
  if (!allowedFields.includes(file.fieldname)) {
    return cb(new Error("Invalid file field"), false);
  }

  if (
    allowedImage.includes(file.mimetype) ||
    allowedDoc.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
