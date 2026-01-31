// controllers/reports/customerReportController.js

const Customer = require("../../models/CustomerReport");

exports.getCustomerReport = async (req, res) => {
  try {
    const { platform, role, kycStatus, status, search, startDate, endDate } =
      req.query;
    const query = {};

    if (platform) query.platform = platform;
    if (role) query.role = role;
    if (kycStatus) query.kycStatus = kycStatus;
    if (status) query.status = status;

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { customerId: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ customers });
  } catch (error) {
    console.error("❌ Customer Report Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
