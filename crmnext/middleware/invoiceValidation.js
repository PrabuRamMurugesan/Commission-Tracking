// // backend/middleware/invoiceValidation.js

// const { body, validationResult } = require("express-validator");

// exports.validateInvoice = [
//   body("invoiceNumber").notEmpty().withMessage("Invoice number is required"),
//   body("invoiceType").notEmpty().withMessage("Invoice type is required"),
//   body("platform").notEmpty().withMessage("Platform is required"),
//   body("role").notEmpty().withMessage("User role is required"),
//   body("userId").notEmpty().withMessage("User ID is required"),
//   body("items")
//     .isArray({ min: 1 })
//     .withMessage("At least one item is required"),
//   body("paymentMode").notEmpty().withMessage("Payment mode is required"),

//   // Optional but validated if present
//   body("gstDetails.cgst").optional().isFloat({ min: 0 }),
//   body("gstDetails.sgst").optional().isFloat({ min: 0 }),
//   body("gstDetails.igst").optional().isFloat({ min: 0 }),

//   body("partialPayment.amountPaid").optional().isFloat({ min: 0 }),
//   body("partialPayment.dueAmount").optional().isFloat({ min: 0 }),
//   body("partialPayment.status").optional().isString(),

//   body("walletUsed").optional().isFloat({ min: 0 }),
//   body("couponCode").optional().isString(),

//   // ✅ Final middleware to check errors
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array(),
//       });
//     }
//     next();
//   },
// ];
