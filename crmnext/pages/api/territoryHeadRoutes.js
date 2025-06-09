// backend/routes/territoryHeadRoutes.js

const express = require('express');
const { 
  getAllTerritoryHeads, 
  getTerritoryHeadById, 
  createTerritoryHead, 
  updateTerritoryHead, 
  deleteTerritoryHead 
} = require('../controllers/territoryHeadController');

const router = express.Router();
const Vendor = require("../models/Vendor");

// ✅ Fetch Vendors for Territory Head Marketplace
router.get("/territoryhead/vendors", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Error retrieving vendors" });
  }
});
// GET all territory heads
router.get('/', getAllTerritoryHeads);

// GET a specific territory head by ID
router.get('/:id', getTerritoryHeadById);

// POST a new territory head
router.post('/', createTerritoryHead);

// PUT to update an existing territory head
router.put('/:id', updateTerritoryHead);

// DELETE a territory head
router.delete('/:id', deleteTerritoryHead);

module.exports = router;
