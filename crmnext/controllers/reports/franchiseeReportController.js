// controllers/reports/franchiseeReportController.js
const Franchisee = require("../../models/FranchiseeReport");

const getFranchiseeReports = async (req, res) => {
  try {
    const { startDate, endDate, search = "" } = req.query;

    const query = {};

    // Date filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { franchiseeId: { $regex: search, $options: "i" } },
      ];
    }

    const data = await Franchisee.find(query).sort({ createdAt: -1 });

    res.status(200).json({ data });
  } catch (error) {
    console.error("❌ Franchisee Report Error:", error);
    res.status(500).json({ message: "Error fetching franchisee report" });
  }
};

module.exports = { getFranchiseeReports };
