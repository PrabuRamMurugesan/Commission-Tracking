import AchievementCommission from "../../models/Commission/AchievementCommission";
const allowedBonusTypes = ["cash", "coupon"];
const allowedTargetTypes = ["sales", "revenue"];
export const createAchievementCommission = async (req, res) => {
  try {
    const {
      role,
      targetType,
      targetValue,
      bonusType,
      bonusValue,
      startDate,
      endDate,
    } = req.body;
    if (!allowedBonusTypes.includes(bonusType)) {
      return res.status(400).json({ error: "Invalid bonus type" });
    }

    if (!allowedTargetTypes.includes(targetType)) {
      return res.status(400).json({ error: "Invalid target type" });
    }
    const newBonus = await AchievementCommission.create({
      role,
      targetType,
      targetValue,
      bonusType,
      bonusValue,
      startDate,
      endDate,
    });

    return res.status(201).json(newBonus);
  } catch (err) {
    console.error("❌ Error in addAchievementCommission:", err.message);
    return res.status(400).json({ error: err.message });
  }
};

export const getAchievementCommissions = async (req, res) => {
  try {
    const query = req.query || {};
    const commissions = await AchievementCommission.find(query);
    res.status(200).json(commissions);
  } catch (err) {
    console.error("Fetch Product Commissions error:", err);
    res.status(500).json({
      message: "Failed to fetch product commissions",
      error: err.message,
    });
  }
};
