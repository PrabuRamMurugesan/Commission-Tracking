// const express = require('express');
// const { 
//   getCustomerBecomeAVendorDashboard, 
//   registerCustomerAsVendor 
// } = require('../controllers/customerBecomeVendorController');

// const router = express.Router();

// // ✅ GET: Route to fetch the vendor dashboard of a customer who became a vendor
// router.get('/:customerId', getCustomerBecomeAVendorDashboard);

// // ✅ POST: Route to register a customer as a vendor
// router.post('/register', registerCustomerAsVendor);

// module.exports = router;

//------------------------------------------------------------------

const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { registerCustomerAsVendor, getCustomerBecomeAVendorDashboard } = require('../controllers/customerBecomeVendorController');
const router = express.Router();

const CustomerBecomeAVendor = require("../models/CustomerBecomeAVendor");

// ✅ Fetch Vendors for Customer Become A Vendor Marketplace
router.get("/customerbecomeavendor/vendors", async (req, res) => {
  try {
    const vendors = await CustomerBecomeAVendor.find();
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Error retrieving vendors" });
  }
});

router.post(
  '/register',
  verifyToken,
  authorizeRoles('Admin'),
  [
    body('customerId').isMongoId().withMessage('Invalid Customer ID'),
    body('vendorDetails').notEmpty().withMessage('Vendor details required'),
  ],
  registerCustomerAsVendor
);

router.get('/:customerId', verifyToken, authorizeRoles('Vendor', 'Admin'), getCustomerBecomeAVendorDashboard);

module.exports = router;
