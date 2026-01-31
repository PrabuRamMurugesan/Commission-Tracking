// crmnext/utils/validateAgent.js

export const validateAgentPayload = (body) => {
  const errors = [];
  const {
    name,
    email,
    phone,
    password,
    platform,
    franchiseeId,
    commissionRates,
  } = body;

  // Required fields
  if (!name) errors.push("name");
  if (!email) errors.push("email");
  if (!phone) errors.push("phone");
  if (!password) errors.push("password");
  if (!platform) errors.push("platform");
  if (!franchiseeId) errors.push("franchiseeId");

  // Check commissionRates
  if (!Array.isArray(commissionRates)) {
    errors.push("commissionRates (should be an array)");
  } else {
    commissionRates.forEach((rate, index) => {
      if (!rate.platform) errors.push(`commissionRates[${index}].platform`);
      if (!rate.productCategory)
        errors.push(`commissionRates[${index}].productCategory`);
      if (typeof rate.rate !== "number")
        errors.push(`commissionRates[${index}].rate (must be number)`);
    });
  }

  return {
    valid: errors.length === 0,
    missing: errors,
  };
};
