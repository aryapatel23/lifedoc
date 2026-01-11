const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/authMiddleware'); // Corrected import

// Get all doctors
// Using authMiddleware to ensure only logged-in users can see doctors list
router.get('/', authMiddleware, doctorController.getAllDoctors);

module.exports = router;
