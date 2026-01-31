// controllers/cbavReportController.js
const CBAV = require("../../models/CBAVReport");

exports.getCBAVReports = async (req, res) => {
  try {
    const cbavs = await CBAV.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: cbavs });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
