export const getFranchiseeDashboard = async (req, res) => {
  const { id } = req.query;

  const agents = await User.find({ role: "agent", franchiseeId: id });
  const vendors = await User.find({ role: "vendor", franchiseeId: id });

  const customers = await User.find({
    $or: [
      { referredByAgent: { $in: agents.map((a) => a._id) } },
      { referredByVendor: { $in: vendors.map((v) => v._id) } },
    ],
  });

  // const transactions = await Transaction.find({ franchiseeId: id });

  res.status(200).json({
    agents,
    vendors,
    customers,
    // transactions,
  });
};
