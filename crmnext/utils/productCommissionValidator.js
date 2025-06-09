export const validateProductCommission = (data) => {
  const {
    platform,
    role,
    productId,
    commissionType,
    commissionValue,
    commissionPercentage,
  } = data;

  if (!platform || !role || !productId || !commissionType) {
    return { valid: false, message: "Missing required fields." };
  }

  if (
    commissionType === "flat" &&
    (commissionValue === undefined || isNaN(commissionValue))
  ) {
    return { valid: false, message: "Flat value must be a number." };
  }

  if (
    commissionType === "percentage" &&
    (commissionPercentage === undefined || isNaN(commissionPercentage))
  ) {
    return { valid: false, message: "Percentage value must be a number." };
  }

  return { valid: true };
};
