// const express = require('express');
// const Sale = require('../models/Sale');
// const Commission = require('../models/Commission');
// const router = express.Router();
// const { createSale } = require('../controllers/saleController');
// const { validateSaleCreation } = require('../validators/salesValidator');
// const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// module.exports = router;

// // Create a sale and generate commission
// router.post('/create', async (req, res) => {
//   try {
//     const { agentId, customerId, productName, saleAmount } = req.body;

//     // Create a new sale
//     const newSale = new Sale({ agentId, customerId, productName, saleAmount });
//     const savedSale = await newSale.save();

//     // Calculate commission (e.g., 10% of saleAmount)
//     const commissionAmount = saleAmount * 0.10;


//     // POST route for creating a new sale
//       router.post('/create', createSale);
     
//       //----- Apply authentication and role-based checks=--------
//       router.post('/create', verifyToken, authorizeRoles('Agent', 'Franchisee'), createSale);


//       // Create a new commission entry
//     const newCommission = new Commission({
//       saleId: savedSale._id,
//       agentId,
//       commissionAmount
//     });
//     await newCommission.save();

//     res.status(201).json({ message: 'Sale created and commission generated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error });
//   }
//   // ✅ POST route for creating a new sale with validation and sale creation logic
// router.post('/create', validateSaleCreation, createSale);
// });

// module.exports = router;



const express = require('express');
const { createSale } = require('../controllers/saleController');
const { validateSaleCreation } = require('../validators/salesValidator');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ POST route for creating a sale (with security, validation, and controller)
router.post(
  '/create',
  verifyToken, // Check if the user is authenticated
  authorizeRoles('Agent', 'Franchisee'), // Only allow agents and franchisees
  validateSaleCreation, // Validate request body (e.g., saleAmount, productName)
  createSale // Call the controller function to handle sale creation
);

// Sample GET route for testing
router.get('/', (req, res) => {
  res.send('Sales endpoint working!');
  });


module.exports = router;
