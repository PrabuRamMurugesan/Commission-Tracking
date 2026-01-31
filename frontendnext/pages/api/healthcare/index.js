import dbConnect from "../../../utils/dbConnect";
import HealthcarePartner from "../../../models/HealthcarePartner";
import multer from "multer";
import path from "path";
import fs from "fs";

export const config = { api: { bodyParser: false } };
export default async function handler(req, res) {
  await dbConnect();

  // -------------------------
  // STORAGE ENGINE (multer)
  // -------------------------
  const uploadDir = path.join(process.cwd(), "/public/uploads/healthcare/");
  fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
  });
  const upload = multer({ storage });

  // -------------------------
  // GET - Fetch all partners
  // -------------------------
  if (req.method === "GET") {
    try {
      const partners = await HealthcarePartner.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: partners });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // -------------------------
  // POST - Register new partner
  // -------------------------
  if (req.method === "POST") {
    return upload.fields([
      { name: "profilePhoto", maxCount: 1 },
      { name: "registrationDoc", maxCount: 1 },
      { name: "clinicLicenseUrl", maxCount: 1 },
      { name: "gstCertificateUrl", maxCount: 1 },
      { name: "aadhaarDocumentUrl", maxCount: 1 },
      { name: "photos", maxCount: 10 }
    ])(req, res, async (err) => {
      if (err) return res.status(500).json({ success: false, error: err.message });

      try {
        const body = req.body;

        const newPartner = await HealthcarePartner.create({
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          gender: body.gender,
          aadhaar: body.aadhaar,
          pan: body.pan,

          clinicName: body.clinicName,
          clinicType: body.clinicType,
          platform: body.platform,
          registrationNumber: body.registrationNumber,
          gstin: body.gstin,
          clinicAddress: body.clinicAddress,

          address: body.address,
          city: body.city,
          district: body.district,
          state: body.state,
          pincode: body.pincode,
          country: body.country,

          supportedServices: body.supportedServices?.split(",") || [],
          supportedPlanTiers: body.supportedPlanTiers?.split(",") || [],

          commissionRates: {
            opd: Number(body.opd || 0),
            ipd: Number(body.ipd || 0),
            labs: Number(body.labs || 0),
          },

          assignedFranchiseId: body.assignedFranchiseId,
          assignedAgentId: body.assignedAgentId,

          profilePhoto: req.files?.profilePhoto?.[0]?.filename || "",
          registrationDocumentUrl: req.files?.registrationDoc?.[0]?.filename || "",
          clinicLicenseUrl: req.files?.clinicLicenseUrl?.[0]?.filename || "",
          gstCertificateUrl: req.files?.gstCertificateUrl?.[0]?.filename || "",
          aadhaarDocumentUrl: req.files?.aadhaarDocumentUrl?.[0]?.filename || "",
          photos: req.files?.photos?.map(f => f.filename) || [],
        });

        return res.status(201).json({ success: true, data: newPartner });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }
    });
  }


  return res
    .status(405)
    .json({ success: false, message: "Method not allowed" });
}
