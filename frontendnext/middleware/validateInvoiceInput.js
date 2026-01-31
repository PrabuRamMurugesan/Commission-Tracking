// middleware/validateInvoiceInput.js

const validateInvoiceInput = (req, res, next) => {
  const {
    customer,
    platform,
    items,
    paymentMethod,
    isRecurring,
    recurringCycle,
    nextDueDate,
  } = req.body;

  if (!customer) {
    return res
      .status(400)
      .json({ success: false, message: "Customer is required." });
  }

  if (!platform) {
    return res
      .status(400)
      .json({ success: false, message: "Platform is required." });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "At least one item is required." });
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.name || !item.quantity || !item.price) {
      return res.status(400).json({
        success: false,
        message: `Item ${i + 1} is missing required fields.`,
      });
    }
    if (item.quantity <= 0 || item.price <= 0) {
      return res.status(400).json({
        success: false,
        message: `Item ${i + 1} must have valid quantity and price.`,
      });
    }
    if (item.taxRate && (item.taxRate < 0 || item.taxRate > 100)) {
      return res.status(400).json({
        success: false,
        message: `Item ${i + 1} has an invalid tax rate.`,
      });
    }
  }

  // Validate recurring
  if (isRecurring && (!recurringCycle || !nextDueDate)) {
    return res.status(400).json({
      success: false,
      message: "Recurring invoices must have cycle and nextDueDate.",
    });
  }

  next();
};

module.exports = validateInvoiceInput;
