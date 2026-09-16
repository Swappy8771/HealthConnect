// routes/admin/doctorRequests.js

const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const { verifyAdmin, allowAdminRoles } = require('../../middlewares/auth');

// GET all doctors (admin access)
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password'); // hide password
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET only pending doctors
router.get('/pending', verifyAdmin, async (req, res) => {
  try {
    const pendingDoctors = await Doctor.find({ status: 'pending' }).select('-password');
    res.status(200).json(pendingDoctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PATCH to approve/reject a doctor
router.patch(
  '/:id/status',
  verifyAdmin,
  allowAdminRoles('super-admin', 'verification-admin'),
  async (req, res) => {
  const { id } = req.params;
  const { status, adminRemarks } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const update = { status };
    if (adminRemarks !== undefined) update.adminRemarks = adminRemarks;

    const doctor = await Doctor.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    res.status(200).json({ message: `Doctor status updated to ${status}`, doctor });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
  }
);

module.exports = router;
