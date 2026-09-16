const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const { JWT_SECRET } = require('../config/env');

// Doctor Registration
router.post('/register', async (req, res) => {
  const {
    fullName,
    email,
    gender,
    password,
    phone,
    specialization,
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

  try {
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = new Doctor({
      fullName,
      email,
      gender,
      password: hashedPassword,
      phone,
      specialization,
      experience,
      education,
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
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    if (doctor.status !== 'approved') {
      return res.status(403).json({ message: 'Your account is pending or suspended by admin' });
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
