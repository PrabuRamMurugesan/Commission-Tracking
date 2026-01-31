import dbConnect from "../../../utils/dbConnect";
import HealthcarePartner from "../../../models/HealthcarePartner";
import { generatePartnerCode } from "../../../utils/generatePartnerCode";
import nextConnect from "next-connect";
import upload from "../../../middleware/upload";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect();

handler.use(
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "registrationDoc", maxCount: 1 },
    { name: "clinicCertificate", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ])
);

handler.post(async (req, res) => {
  try {
    await dbConnect();

    // Read all fields CORRECTLY
    const {
      fullName,
      email,
      phone,
      aadhaar,
      pan,
      address,
      city,
      district,
      state,
      pincode,
      country,
      clinicName,
      clinicType,
      clinicAddress,
      registrationNumber,
      platform,
      gstin,
      createdBy,
    } = req.body;

    // Make sure fullName exists
    if (!fullName) {
      return res.status(400).json({
        success: false,
        error: "fullName is required",
      });
    }

    const partnerCode = await generatePartnerCode(state, city);

    // File handling
    const profilePhoto = req.files?.profilePhoto?.[0]?.filename || null;
    const registrationDoc = req.files?.registrationDoc?.[0]?.filename || null;
    const clinicCertificate =
      req.files?.clinicCertificate?.[0]?.filename || null;
    const idProof = req.files?.idProof?.[0]?.filename || null;

    const partner = await HealthcarePartner.create({
      partnerCode,
      fullName,
      email,
      phone,
      aadhaar,
      pan,
      address,
      city,
      district,
      state,
      pincode,
      country,
      clinicName,
      clinicType,
      clinicAddress,
      registrationNumber,
      platform,
      gstin,
      registrationDoc,
      profilePhoto,
      clinicCertificate,
      idProof,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "Healthcare Partner created successfully",
      data: partner,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default handler;
