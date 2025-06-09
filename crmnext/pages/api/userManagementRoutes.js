// routes/userManagementRoutes.js
const express = require("express");
const { getUsers, addUser } = require("../controllers/userManagementController");
const router = express.Router();

router.get("/", getUsers);
router.post("/", addUser);

module.exports = router;
