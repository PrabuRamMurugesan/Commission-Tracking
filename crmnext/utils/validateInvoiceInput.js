// utils/validateInvoiceInput.js
const validateInvoiceInput = (data) => {
  const errors = {};

  if (!data.buyer?.name) errors.buyerName = "Buyer name is required";
  if (!data.buyer?.gstin) errors.buyerGST = "Buyer GSTIN is required";
  if (!data.buyer?.state) errors.buyerState = "Buyer state is required";

  if (!data.seller?.name) errors.sellerName = "Seller name is required";
  if (!data.seller?.gstin) errors.sellerGST = "Seller GSTIN is required";
  if (!data.seller?.state) errors.sellerState = "Seller state is required";

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.items = "At least one invoice item is required";
  } else {
    data.items.forEach((item, idx) => {
      if (!item.name || !item.amount || !item.gstType) {
        errors[`item-${idx}`] = "Each item must have name, amount, GST type";
      }
    });
  }

  if (!data.payment?.amountPaid) errors.amountPaid = "Amount paid is required";
  if (!data.payment?.mode) errors.paymentMode = "Payment mode is required";

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
};

export default validateInvoiceInput;
