const express = require('express');
const router = express.Router();

// Middleware to protect routes
const { verifyPatient } = require('../../middlewares/auth');

// Controller methods
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require('../../controllers/PatientController');

// @route    GET /api/patient/me
// @desc     Get logged-in patient profile
// @access   Private
router.get('/me', verifyPatient, getProfile);

// @route    PUT /api/patient/me
// @desc     Update logged-in patient profile
// @access   Private
router.put('/me', verifyPatient, updateProfile);

// @route    DELETE /api/patient/me
// @desc     Delete logged-in patient profile
// @access   Private
router.delete('/me', verifyPatient, deleteProfile);

module.exports = router;
