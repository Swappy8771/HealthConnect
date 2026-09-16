const express = require('express');
const router = express.Router();
const Doctor = require('../../models/Doctor');
const { verifyDoctor, requireApprovedDoctor } = require('../../middlewares/auth');
const {
  listDoctorAppointments,
  cancelAppointment,
} = require('../../controllers/AppointmentController');

// Every route here needs a doctor who is still approved — `status` is checked
// at login, but a token lives for a day.
router.use(verifyDoctor, requireApprovedDoctor);

// GET /api/doctor/availability
router.get('/availability', (req, res) => {
  res.status(200).json({
    availability: req.doctor.availability,
    slotMinutes: req.doctor.slotMinutes,
  });
});

// PUT /api/doctor/availability
router.put('/availability', async (req, res, next) => {
  try {
    const { availability, slotMinutes } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({ message: 'availability must be an array' });
    }

    for (const window of availability) {
      if (!Number.isInteger(window?.dayOfWeek) || window.dayOfWeek < 0 || window.dayOfWeek > 6) {
        return res.status(400).json({ message: 'dayOfWeek must be an integer 0-6' });
      }
      if (window.endTime <= window.startTime) {
        return res.status(400).json({ message: 'endTime must be after startTime' });
      }
    }

    const update = { availability };
    if (slotMinutes !== undefined) update.slotMinutes = slotMinutes;

    const doctor = await Doctor.findByIdAndUpdate(req.doctor._id, update, {
      new: true,
      runValidators: true,
    }).select('availability slotMinutes');

    res.status(200).json(doctor);
  } catch (err) {
    next(err);
  }
});

// GET /api/doctor/appointments
router.get('/appointments', listDoctorAppointments);
router.patch('/appointments/:id/cancel', cancelAppointment('doctor'));

module.exports = router;
