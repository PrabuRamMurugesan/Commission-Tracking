import dbConnect from "../../../utils/dbConnect";
import HealthcarePartner from "../../../models/HealthcarePartner";
import nextConnect from "next-connect";
import { upload } from "../../../middleware/upload";

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
  ])
);

handler.get(async (req, res) => {
  await dbConnect();
  const { id } = req.query;

  try {
    const partner = await HealthcarePartner.findById(id);

    if (!partner)
      return res.status(404).json({ success: false, message: "Not found" });

    return res.status(200).json({ success: true, data: partner });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

handler.put(async (req, res) => {
  await dbConnect();
  const { id } = req.query;

  try {
    const updateData = req.body;

    if (req.files?.profilePhoto) {
      updateData.profilePhoto = req.files.profilePhoto[0].filename;
    }

    if (req.files?.registrationDoc) {
      updateData.registrationDoc = req.files.registrationDoc[0].filename;
    }
    if (req.files?.clinicLicenseUrl) {
      updateData.clinicLicenseUrl = req.files.clinicLicenseUrl[0].filename;
    }
    if (req.files?.gstCertificateUrl) {
      updateData.gstCertificateUrl = req.files.gstCertificateUrl[0].filename;
    }
    if (req.files?.aadhaarDocumentUrl) {
      updateData.aadhaarDocumentUrl = req.files.aadhaarDocumentUrl[0].filename;
    }
    if (req.files?.photos) {
      updateData.photos = req.files.photos.map(f => f.filename);
    }

    updateData.supportedServices = updateData.supportedServices?.split(",") || [];
    updateData.supportedPlanTiers = updateData.supportedPlanTiers?.split(",") || [];

    updateData.commissionRates = {
      opd: Number(updateData.opd || 0),
      ipd: Number(updateData.ipd || 0),
      labs: Number(updateData.labs || 0),
    };
    const partner = await HealthcarePartner.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: partner,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

handler.delete(async (req, res) => {
  await dbConnect();
  const { id } = req.query;

  try {
    await HealthcarePartner.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Healthcare partner deleted",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default handler;
