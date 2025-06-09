// controllers/reports/vendorReportController.js
import Vendor from "../../models/Vendor/Vendor";
// import Order from "../../models/Order";
import Transaction from "../../models/Transaction";

// controllers/reports/vendorReportController.js
export const getVendorReports = async (req, res) => {
  try {
    const vendors = await Vendor.find({});
    const reportData = await Promise.all(
      vendors.map(async (vendor) => {
        // const totalOrders = await Order.countDocuments({ vendorId: vendor._id });
        const commission = await Transaction.aggregate([
          { $match: { vendorId: vendor._id } },
          { $group: { _id: null, total: { $sum: "$commissionApplied" } } }
        ]);
        return {
          vendorId: vendor._id,
          name: vendor.name,
          email: vendor.email,
          phone: vendor.phone,
          platform: vendor.platform || "BBSCART",
          role: vendor.role,
          zone: vendor.zone || "Unassigned",
          status: vendor.status || "Active",
          kycStatus: vendor.kycStatus || "Pending",
          // totalOrders,
          commissionEarned: commission[0]?.total || 0,
          walletBalance: vendor.walletBalance || 0
        };
      })
    );

    // ✅ This is what MUST be called!
    res.status(200).json({ vendors: reportData });

  } catch (err) {
    console.error("❌ Vendor Report Error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

