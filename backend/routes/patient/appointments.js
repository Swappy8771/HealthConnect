const express = require('express');
const router = express.Router();
const { verifyPatient } = require('../../middlewares/auth');
const {
  getDoctorSlots,
  bookAppointment,
  listPatientAppointments,
  cancelAppointment,
} = require('../../controllers/AppointmentController');

// Open slots for one doctor on one date
router.get('/doctors/:id/slots', verifyPatient, getDoctorSlots);

// Book, list and cancel
router.post('/appointments', verifyPatient, bookAppointment);
router.get('/appointments', verifyPatient, listPatientAppointments);
router.patch('/appointments/:id/cancel', verifyPatient, cancelAppointment('patient'));

module.exports = router;
