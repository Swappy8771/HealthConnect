const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { generateSlots, availableSlots, parseDate } = require('../lib/slots');

/** Mongo's duplicate-key error — the unique index refusing a double booking. */
const isDuplicateKey = (err) => err && err.code === 11000;

// GET /api/patient/doctors/:id/slots?date=YYYY-MM-DD
const getDoctorSlots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!parseDate(date)) {
      return res.status(400).json({ message: 'Provide ?date=YYYY-MM-DD' });
    }

    const doctor = await Doctor.findOne({ _id: id, status: 'approved' })
      .select('availability slotMinutes clinic fullName specialization');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    const slots = generateSlots({
      availability: doctor.availability,
      slotMinutes: doctor.slotMinutes,
      date,
    });

    if (slots.length === 0) {
      return res.status(200).json({ doctor: doctor.fullName, date, slots: [] });
    }

    const booked = await Appointment.find({
      doctor: id,
      status: 'booked',
      startsAt: { $gte: slots[0].startsAt, $lte: slots[slots.length - 1].startsAt },
    }).select('startsAt');

    res.status(200).json({
      doctor: doctor.fullName,
      date,
      slotMinutes: doctor.slotMinutes,
      fee: doctor.clinic?.consultationFee,
      slots: availableSlots({
        slots,
        takenStartTimes: booked.map((a) => a.startsAt),
      }),
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/patient/appointments
const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, startsAt, consultationType, reason } = req.body;

    const start = new Date(startsAt);
    if (!startsAt || Number.isNaN(start.getTime())) {
      return res.status(400).json({ message: 'startsAt must be a valid date-time' });
    }
    if (start <= new Date()) {
      return res.status(400).json({ message: 'Cannot book a slot in the past' });
    }

    const doctor = await Doctor.findOne({ _id: doctorId, status: 'approved' });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    // The slot must be one the doctor actually offers — a client cannot invent
    // a time outside the published availability.
    const date = start.toISOString().slice(0, 10);
    const offered = generateSlots({
      availability: doctor.availability,
      slotMinutes: doctor.slotMinutes,
      date,
    }).some((slot) => slot.startsAt.getTime() === start.getTime());

    if (!offered) {
      return res.status(400).json({ message: 'That slot is not offered by this doctor' });
    }

    const appointment = await Appointment.create({
      patient: req.patient._id,
      doctor: doctor._id,
      startsAt: start,
      endsAt: new Date(start.getTime() + doctor.slotMinutes * 60000),
      consultationType:
        consultationType ||
        (doctor.clinic?.consultationType === 'Both'
          ? 'Offline'
          : doctor.clinic?.consultationType) ||
        'Offline',
      // Snapshot the fee: a later profile edit must not change what was agreed.
      fee: doctor.clinic?.consultationFee,
      reason,
    });

    res.status(201).json({ message: 'Appointment booked', appointment });
  } catch (err) {
    // The unique index rejected it: someone else took the slot first, or this
    // patient already holds an appointment at that instant.
    if (isDuplicateKey(err)) {
      return res.status(409).json({
        message: 'That slot has just been taken. Please choose another.',
        code: 'SLOT_TAKEN',
      });
    }
    next(err);
  }
};

// GET /api/patient/appointments
const listPatientAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { patient: req.patient._id };
    if (['booked', 'completed', 'cancelled', 'no-show'].includes(status)) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .sort({ startsAt: 1 })
      .populate('doctor', 'fullName specialization clinic');

    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

// GET /api/doctor/appointments
const listDoctorAppointments = async (req, res, next) => {
  try {
    const { date, status } = req.query;
    const filter = { doctor: req.doctor._id };

    if (['booked', 'completed', 'cancelled', 'no-show'].includes(status)) {
      filter.status = status;
    }
    if (date) {
      const day = parseDate(date);
      if (!day) return res.status(400).json({ message: 'date must be YYYY-MM-DD' });
      filter.startsAt = {
        $gte: day,
        $lt: new Date(day.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    const appointments = await Appointment.find(filter)
      .sort({ startsAt: 1 })
      .populate('patient', 'fullName phone gender dateOfBirth');

    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

/** Shared by the patient and doctor cancel routes. */
const cancelAppointment = (actor) => async (req, res, next) => {
  try {
    const owner = actor === 'patient'
      ? { patient: req.patient._id }
      : { doctor: req.doctor._id };

    const appointment = await Appointment.findOne({ _id: req.params.id, ...owner });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.status !== 'booked') {
      return res.status(409).json({
        message: `This appointment is already ${appointment.status}`,
      });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = actor;
    appointment.cancelledAt = new Date();
    appointment.cancellationReason = req.body?.reason;
    await appointment.save();

    res.status(200).json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDoctorSlots,
  bookAppointment,
  listPatientAppointments,
  listDoctorAppointments,
  cancelAppointment,
};
