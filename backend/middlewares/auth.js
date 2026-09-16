const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

// Extract a Bearer token from the Authorization header.
const extractToken = (req) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

/**
 * Build a guard for one actor.
 *
 * The three actors differ only in which JWT claim they carry, which collection
 * they live in and where they hang off `req` — so they share this factory
 * rather than three near-identical copies.
 *
 * `check` is an optional extra assertion run once the document is loaded; it
 * returns an error message to reject with, or null to allow.
 */
const verifyActor = ({ claim, model, attachAs, label, check }) => async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'Token missing' });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // Distinguish the two cases: an expired token means "log in again", a
    // malformed one means something is wrong with the client.
    const expired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      message: expired ? 'Session expired, please log in again' : 'Invalid token',
      code: expired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
    });
  }

  if (!decoded?.[claim]) {
    return res.status(401).json({ message: 'Invalid token payload' });
  }

  try {
    // Re-read on every request so a deleted or suspended account loses access
    // immediately, rather than when its 24-hour token happens to expire.
    const doc = await model.findById(decoded[claim]).select('-password');
    if (!doc) return res.status(404).json({ message: `${label} not found` });

    const problem = check ? check(doc) : null;
    if (problem) return res.status(403).json({ message: problem });

    req[attachAs] = doc;
    next();
  } catch (err) {
    next(err);
  }
};

const verifyPatient = verifyActor({
  claim: 'patientId', model: Patient, attachAs: 'patient', label: 'Patient',
});

const verifyDoctor = verifyActor({
  claim: 'doctorId', model: Doctor, attachAs: 'doctor', label: 'Doctor',
});

const verifyAdmin = verifyActor({
  claim: 'adminId', model: Admin, attachAs: 'admin', label: 'Admin',
  // Suspension was previously checked only at login, so a suspended admin kept
  // working until their token expired.
  check: (admin) =>
    admin.status !== 'active' ? 'Your account has been suspended' : null,
});

// Require an approved doctor. `status` is checked at login, but a token lives
// for a day — chain this after verifyDoctor on any route that does real work.
const requireApprovedDoctor = (req, res, next) => {
  if (!req.doctor || req.doctor.status !== 'approved') {
    return res.status(403).json({
      message: 'Your account is not approved',
      status: req.doctor ? req.doctor.status : 'unknown',
    });
  }
  next();
};

// Role-based access control for admins.
const allowAdminRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.admin || !allowedRoles.includes(req.admin.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient privileges' });
  }
  next();
};

module.exports = {
  verifyPatient,
  verifyDoctor,
  verifyAdmin,
  requireApprovedDoctor,
  allowAdminRoles,
};
