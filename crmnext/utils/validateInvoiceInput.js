export default function validateInvoiceInput(data) {
  const errors = [];

  // Invoice Info
  if (!data.invoiceNumber || typeof data.invoiceNumber !== "string") {
    errors.push("Invoice Number is required and must be a string.");
  }

  if (!data.invoiceDate || isNaN(Date.parse(data.invoiceDate))) {
    errors.push("Invoice Date is invalid.");
  }

  if (
    !data.platform ||
    !["BBSCART", "GOLDEX", "DELIVERY", "EMERJOBS"].includes(data.platform)
  ) {
    errors.push("Platform must be selected.");
  }

  // Buyer Info
  if (!data.buyer?.name || typeof data.buyer.name !== "string") {
    errors.push("Buyer Name is required.");
  }

  // Invoice Items
  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push("At least one invoice item is required.");
  } else {
    data.items.forEach((item, i) => {
      if (!item.name || typeof item.name !== "string") {
        errors.push(`Item ${i + 1} name is required.`);
      }
      if (typeof item.amount !== "number" || item.amount <= 0) {
        errors.push(`Item ${i + 1} amount must be greater than 0.`);
      }
      if (item.cgst + item.sgst + item.igst > 100) {
        errors.push(`Total GST for Item ${i + 1} cannot exceed 100%.`);
      }
    });
  }

  // Payment Info
  if (
    typeof data.payment?.amountPaid !== "number" ||
    data.payment.amountPaid < 0
  ) {
    errors.push("Amount Paid must be a positive number.");
  }

  if (
    !["Cash", "Card", "Wallet", "Escrow", "UPI", "Bank Transfer"].includes(
      data.payment?.mode
    )
  ) {
    errors.push("Select a valid payment mode.");
  }

  // Total Logic
  if (typeof data.totalAmount !== "number" || data.totalAmount <= 0) {
    errors.push("Total amount must be greater than 0.");
  }

  if (typeof data.grandTotal !== "number" || data.grandTotal <= 0) {
    errors.push("Grand total must be greater than 0.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
