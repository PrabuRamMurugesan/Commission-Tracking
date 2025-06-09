// const express = require('express');
// const { createFranchise } = require('../controllers/franchiseController');
// const router = express.Router();
// const Vendor = require("../models/Vendor");

// // ✅ Fetch Vendors for Franchise Marketplace
// router.get("/franchise/vendors", async (req, res) => {
//   try {
//     const vendors = await Vendor.find();
//     res.json(vendors);
//   } catch (error) {
//     console.error("Error fetching vendors:", error);
//     res.status(500).json({ message: "Error retrieving vendors" });
//   }
// });
// // ✅ POST route to create a franchise
// router.post('/create', createFranchise);

// module.exports = router;
