export const validateGstLog = (data) => {
  const errors = [];

  if (!data.userId) errors.push("Missing userId");
  if (!data.role) errors.push("Missing role");
  if (!["GSTR-1", "GSTR-3B"].includes(data.returnType))
    errors.push("Invalid returnType");
  if (!data.period) errors.push("Missing period");
  if (
    !data.gstin ||
    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
      data.gstin
    )
  ) {
    errors.push("Invalid GSTIN");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
