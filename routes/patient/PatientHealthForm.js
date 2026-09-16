const express = require('express');
const router = express.Router();
const { verifyPatient } = require('../../middlewares/auth');

const {
  getHealthData,
  updateHealthData
} = require('../../controllers/PatientHealthController');

// Protect all health routes with verifyPatient middleware
router.get('/', verifyPatient, getHealthData);
router.put('/', verifyPatient, updateHealthData);

module.exports = router;
