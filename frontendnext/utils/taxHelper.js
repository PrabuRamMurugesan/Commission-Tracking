export const calculateGstSplit = (amount, gstRate, type) => {
  const gstAmount = (amount * gstRate) / 100;

  let cgst = 0,
    sgst = 0,
    igst = 0;

  if (type === "CGST_SGST") {
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  } else if (type === "IGST") {
    igst = gstAmount;
  }

  return { gstAmount, cgst, sgst, igst };
};
