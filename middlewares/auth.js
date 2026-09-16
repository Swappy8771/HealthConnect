const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

// Utility: Extract Bearer token from header
const extractToken = (req) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

// Utility: Verify token with secret and handle errors safely
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

// Middleware: Verify Patient JWT
const verifyPatient = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = verifyToken(token);
    if (!decoded?.patientId) return res.status(401).json({ message: 'Invalid token payload' });

    const patient = await Patient.findById(decoded.patientId).select('-password');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    req.patient = patient;
    next();
  } catch (err) {
    console.error("Patient JWT Error:", err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware: Verify Doctor JWT
const verifyDoctor = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = verifyToken(token);
    if (!decoded?.doctorId) return res.status(401).json({ message: 'Invalid token payload' });

    const doctor = await Doctor.findById(decoded.doctorId).select('-password');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    req.doctor = doctor;
    next();
  } catch (err) {
    console.error("Doctor JWT Error:", err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware: Verify Admin JWT
const verifyAdmin = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return res.status(401).json({ message: 'Token missing' });

    const decoded = verifyToken(token);
    if (!decoded?.adminId) return res.status(401).json({ message: 'Invalid token payload' });

    const admin = await Admin.findById(decoded.adminId).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    req.admin = admin;
    next();
  } catch (err) {
    console.error("Admin JWT Error:", err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Optional: Role-based access control for Admins
const allowAdminRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient privileges' });
    }
    next();
  };
};

module.exports = {
  verifyPatient,
  verifyDoctor,
  verifyAdmin,
  allowAdminRoles,
};
