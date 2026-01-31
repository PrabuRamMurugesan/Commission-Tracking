import ProductCommission from "../../models/Commission/ProductCommission";

export const createProductCommission = async (req, res) => {
  try {
    const {
      platform,
      role,
      productId,
      commissionType,
      commissionValue,
      commissionPercentage,
    } = req.body;

    const newRule = await ProductCommission.create({
      platform,
      role,
      productId,
      commissionType,
      commissionValue: commissionType === "flat" ? commissionValue : undefined,
      commissionPercentage:
        commissionType === "percentage" ? commissionPercentage : undefined,
    });

    res.status(201).json({
      message: "Product commission created",
      data: newRule,
    });
  } catch (err) {
    console.error("Create Product Commission error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getProductCommissions = async (req, res) => {
  try {
    const query = req.query || {};
    const commissions = await ProductCommission.find(query);
    res.status(200).json(commissions);
  } catch (err) {
    console.error("Fetch Product Commissions error:", err);
    res.status(500).json({
      message: "Failed to fetch product commissions",
      error: err.message,
    });
  }
};
