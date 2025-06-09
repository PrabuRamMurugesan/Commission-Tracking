import validateInvoiceInput from "../utils/validateInvoiceInput";

const { isValid, errors } = validateInvoiceInput(req.body);
if (!isValid) {
  return res.status(400).json({ success: false, errors });
}
