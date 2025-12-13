// backend/routes/customerRoutes.js

const express = require('express');
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');

const router = express.Router();

// GET all customers
router.get('/', getAllCustomers);

// GET a specific customer by ID
router.get('/:id', getCustomerById);

// POST a new customer
router.post('/', createCustomer);

// PUT to update an existing customer
router.put('/:id', updateCustomer);

// DELETE a customer
router.delete('/:id', deleteCustomer);

module.exports = router;
