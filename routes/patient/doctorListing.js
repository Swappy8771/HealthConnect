const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const { verifyPatient } = require('../../middlewares/auth');

// GET /api/patient/doctors-by-category
router.get('/doctors-by-category', verifyPatient, async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'approved' }).select('-password');

    const categorized = {};
    for (let doc of doctors) {
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
