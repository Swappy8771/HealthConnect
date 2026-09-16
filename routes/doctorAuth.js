const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const { JWT_SECRET } = require('../config/env');
const { loginLimiter, registerLimiter } = require('../middlewares/rateLimit');
const { validatePassword } = require('../models/validators');

// Doctor Registration
router.post('/register', registerLimiter, async (req, res) => {
  const {
    fullName,
    email,
    gender,
    password,
    phone,
    specialization,
    category,
    experience,
    education,
    clinic,
    documents
  } = req.body;

  // Note: a plain `!value` check would reject `experience: 0`, which is a valid
  // value for a newly qualified doctor (the schema allows `min: 0`).
  const isMissing = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0);

  const required = { fullName, email, gender, password, phone, specialization, experience, education };
  const missing = Object.keys(required).filter((key) => isMissing(required[key]));

  if (missing.length) {
    return res.status(400).json({
      message: `Please provide all required fields. Missing: ${missing.join(', ')}`,
    });
  }

  const weakPassword = validatePassword(password);
  if (weakPassword) {
    return res.status(400).json({ message: weakPassword });
  }

  // A blank education row arrives as [""], which passes a presence check but
  // fails the schema's per-element `required` with an opaque 500.
  const cleanedEducation = Array.isArray(education)
    ? education.map((e) => String(e).trim()).filter(Boolean)
    : education;

  if (Array.isArray(cleanedEducation) && cleanedEducation.length === 0) {
    return res.status(400).json({ message: 'Please provide at least one education entry.' });
  }

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // The password is hashed by the pre('save') hook on the model.
    const doctor = new Doctor({
      fullName,
      email,
      gender,
      password,
      phone,
      specialization,
      ...(category ? { category } : {}),
      experience,
      education: cleanedEducation,
      clinic,
      documents,
      status: 'pending'  // Important for admin approval logic
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor registered successfully. Awaiting admin approval.' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Doctor Login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    if (doctor.status !== 'approved') {
      // Say which it is — 'pending' and 'rejected' need different actions from
      // the doctor, and an opaque message leaves them waiting forever.
      const message =
        doctor.status === 'rejected'
          ? 'Your application was not approved. Please contact the clinic administrator.'
          : 'Your account is awaiting admin approval. You will be able to log in once it is reviewed.';

      return res.status(403).json({
        message,
        status: doctor.status,
        ...(doctor.adminRemarks ? { adminRemarks: doctor.adminRemarks } : {}),
      });
    }

    const token = jwt.sign(
      { doctorId: doctor._id, role: 'doctor' },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      doctor: {
        id: doctor._id,
        name: doctor.fullName,
        specialization: doctor.specialization
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
