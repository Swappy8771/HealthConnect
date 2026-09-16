const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');

// POST /api/patient/signup
router.post('/register', async (req, res) => {
  const { fullName, email,phone, gender, password } = req.body;

  if (!fullName || !email || !phone || !gender || !password ) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = new Patient({
      fullName,
      email,
       phone,
      gender,
      password: hashedPassword,
     
    });

    await newPatient.save();

    res.status(201).json({ message: 'Patient registered successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/patient/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { patientId: patient._id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      patient: {
        id: patient._id,
        fullName: patient.fullName,
        email: patient.email,
        gender: patient.gender,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
