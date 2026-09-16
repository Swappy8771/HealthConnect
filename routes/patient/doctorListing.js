const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const { verifyPatient } = require('../../middlewares/auth');

// GET /api/patient/doctors
//
// Returns a flat array of approved doctors. Only approved doctors are ever
// exposed to patients — this filter is the product's safety guarantee.
router.get('/doctors', verifyPatient, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'approved' }).select('-password');
    res.status(200).json(doctors);
  } catch (err) {
    console.error('Doctor listing error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/patient/doctors-by-category
//
// The same set, grouped by specialization, for a sectioned view.
router.get('/doctors-by-category', verifyPatient, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'approved' }).select('-password');

    const categorized = {};
    for (const doc of doctors) {
      const category = doc.specialization || 'Others';
      if (!categorized[category]) categorized[category] = [];
      categorized[category].push(doc);
    }

    res.status(200).json(categorized);
  } catch (err) {
    console.error('Doctor listing error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
