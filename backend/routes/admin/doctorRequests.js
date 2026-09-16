// routes/admin/doctorRequests.js

const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const { verifyAdmin, allowAdminRoles } = require('../../middlewares/auth');

// GET doctors. `?status=pending|approved|rejected` filters; omit for all.
router.get('/', verifyAdmin, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = ['pending', 'approved', 'rejected'].includes(status) ? { status } : {};

    const doctors = await Doctor.find(filter)
      .select('-password')
      .populate('reviewedBy', 'name email');

    res.status(200).json(doctors);
  } catch (err) {
    next(err);
  }
});

// GET only pending doctors. Kept for compatibility; equivalent to ?status=pending.
router.get('/pending', verifyAdmin, async (req, res, next) => {
  try {
    const pendingDoctors = await Doctor.find({ status: 'pending' }).select('-password');
    res.status(200).json(pendingDoctors);
  } catch (err) {
    next(err);
  }
});

// PATCH to approve/reject a doctor
router.patch(
  '/:id/status',
  verifyAdmin,
  allowAdminRoles('super-admin', 'verification-admin'),
  async (req, res, next) => {
  const { id } = req.params;
  const { status, adminRemarks } = req.body;

  // 'pending' is allowed so a misclick can be undone; previously a wrong
  // decision could only be reversed by editing the database directly.
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const update = {
      status,
      reviewedBy: req.admin._id,
      reviewedAt: new Date(),
    };
    if (adminRemarks !== undefined) update.adminRemarks = adminRemarks;

    const doctor = await Doctor.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    res.status(200).json({ message: `Doctor status updated to ${status}`, doctor });
  } catch (err) {
    next(err);
  }
  }
);

module.exports = router;
