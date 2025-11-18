import HealthcareBeneficiary from "../models/HealthcareBeneficiary";
import dbConnect from "../utils/dbConnect";

// ------------------------
// Create Beneficiary
// ------------------------
export const createBeneficiary = async (req, res) => {
  try {
    await dbConnect();
console.log("===== Beneficiary CREATE - BODY =====");
console.log(req.body);
console.log("===== Beneficiary CREATE - FILES =====");
console.log(req.files);

    // File uploads (filenames only)
    const profilePhoto = req.files?.profilePhoto?.[0]?.filename || null;
    const aadhaarDocumentUrl =
      req.files?.aadhaarDocumentUrl?.[0]?.filename || null;

    const data = {
      ...req.body,
      profilePhoto,
      aadhaarDocumentUrl,
    
    };

    const beneficiary = await HealthcareBeneficiary.create(data);

    return res.status(201).json({
      success: true,
      message: "Beneficiary created successfully",
      data: beneficiary,
    });
  } catch (err) {
    console.log("Create Beneficiary Error:", err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ------------------------
// Get all beneficiaries
// ------------------------
export const getBeneficiaries = async (req, res) => {
  try {
    await dbConnect();

    const filters = {
      deletedAt: null,
    };

    if (req.query.createdBy) filters.createdBy = req.query.createdBy;
    if (req.query.city) filters.city = req.query.city;
    if (req.query.state) filters.state = req.query.state;
    if (req.query.planType) filters.planType = req.query.planType;
    if (req.query.status) filters.status = req.query.status;

    const beneficiaries = await HealthcareBeneficiary.find(filters).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: beneficiaries,
    });
  } catch (err) {
    console.log("Get Beneficiaries Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ------------------------
// Get single beneficiary
// ------------------------
export const getBeneficiaryById = async (req, res) => {
  try {
    await dbConnect();

    const beneficiary = await HealthcareBeneficiary.findById(req.query.id);

    if (!beneficiary)
      return res.status(404).json({
        success: false,
        error: "Beneficiary not found",
      });

    return res.status(200).json({
      success: true,
      data: beneficiary,
    });
  } catch (err) {
    console.log("Get Beneficiary Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ------------------------
// Update beneficiary
// ------------------------
export const updateBeneficiary = async (req, res) => {
  try {
    await dbConnect();

    const updates = { ...req.body };

    if (req.files?.profilePhoto)
      updates.profilePhoto = req.files.profilePhoto[0].filename;

    if (req.files?.aadhaarDocumentUrl)
      updates.aadhaarDocumentUrl = req.files.aadhaarDocumentUrl[0].filename;

    const beneficiary = await HealthcareBeneficiary.findByIdAndUpdate(
      req.query.id,
      updates,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Beneficiary updated successfully",
      data: beneficiary,
    });
  } catch (err) {
    console.log("Update Beneficiary Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ------------------------
// Soft Delete Beneficiary
// ------------------------
export const deleteBeneficiary = async (req, res) => {
  try {
    await dbConnect();

    await HealthcareBeneficiary.findByIdAndUpdate(req.query.id, {
      deletedAt: new Date(),
      status: "inactive",
    });

    return res.status(200).json({
      success: true,
      message: "Beneficiary deleted successfully",
    });
  } catch (err) {
    console.log("Delete Beneficiary Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
