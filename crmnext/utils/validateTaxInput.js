export const validateTaxInput = (data) => {
  const errors = [];

  if (!data.name) errors.push("Category name is required");
  if (!data.categorySlug) errors.push("Category slug is required");
  if (typeof data.gstRate !== "number" || data.gstRate < 0)
    errors.push("GST Rate must be a positive number");
  if (!Array.isArray(data.applicableTo) || data.applicableTo.length === 0)
    errors.push("Applicable To must have at least one type");

  return {
    isValid: errors.length === 0,
    errors,
  };
};
