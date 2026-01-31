export const validateAchievementCommission = (data) => {
  const { role, targetType, targetValue, bonusType, bonusValue } = data;

  if (!role || !targetType || !targetValue || !bonusType || !bonusValue) {
    return { valid: false, message: "All fields are required." };
  }

  if (!["sales", "revenue", "quantity"].includes(targetType)) {
    return { valid: false, message: "Invalid target type." };
  }

  if (!["cash", "coupen"].includes(bonusType)) {
    return { valid: false, message: "Invalid bonus type." };
  }

  return { valid: true };
};
