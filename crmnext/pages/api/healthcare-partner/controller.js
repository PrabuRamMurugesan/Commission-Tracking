import dbConnect from "../../../lib/mongodb";
import HealthcarePartner from "../../../models/HealthcarePartner";
import multer from "multer";
import fs from "fs";
import path from "path";

await dbConnect();

// Upload Config
const uploadDir = path.join(
  process.cwd(),
  "/public/uploads/healthcarePartners/"
);
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Handlers
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const data = await HealthcarePartner.find().sort({ createdAt: -1 });
      return res.status(200).json(data);

    case "POST":
      upload.fields([
        { name: "panCard", maxCount: 1 },
        { name: "aadharCard", maxCount: 1 },
        { name: "gstCertificate", maxCount: 1 },
        { name: "profileImage", maxCount: 1 },
        { name: "digitalSignature", maxCount: 1 },
      ])(req, res, async (err) => {
        if (err)
          return res.status(500).json({ message: "Upload error", error: err });

        const body = req.body;
        const files = req.files;

        const newPartner = new HealthcarePartner({
        fullName: body.fullName,
          businessName: body.businessName,
          email: body.email,
          phone: body.phone,
          address: body.address,
          city: body.city,
          state: body.state,
          pincode: body.pincode,
          createdBy: body.createdBy,

          panCard: files?.panCard?.[0]?.filename,
          aadharCard: files?.aadharCard?.[0]?.filename,
          gstCertificate: files?.gstCertificate?.[0]?.filename,
          profileImage: files?.profileImage?.[0]?.filename,
          digitalSignature: files?.digitalSignature?.[0]?.filename,
        });

        await newPartner.save();
        return res
          .status(201)
          .json({ message: "Healthcare Partner Registered", data: newPartner });
      });
      break;

    case "PUT":
      const { _id, ...rest } = req.body;
      const updated = await HealthcarePartner.findByIdAndUpdate(_id, rest, {
        new: true,
      });
      return res.status(200).json({ message: "Updated", data: updated });

    case "DELETE":
      const deleted = await HealthcarePartner.findByIdAndDelete(req.query.id);
      return res.status(200).json({ message: "Deleted", data: deleted });

    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
