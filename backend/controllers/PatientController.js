const Patient = require('../models/Patient');

// Only these may be changed through PUT /api/patient/me.
// Everything else in the body is ignored — notably `password`, which must only
// ever be written by a route that hashes it first, and `email`, which is the
// login identifier.
const UPDATABLE_FIELDS = [
  'fullName',
  'phone',
  'gender',
  'dateOfBirth',
  'profileImage',
];

const pick = (source, allowed) =>
  allowed.reduce((out, key) => {
    if (source[key] !== undefined) out[key] = source[key];
    return out;
  }, {});

// Account fields returned by GET /me. The health fields live on the same
// document but belong to the health-form endpoint, so this no longer dumps a
// patient's entire medical record on every profile load.
const PROFILE_FIELDS = [
  '_id',
  'fullName',
  'email',
  'phone',
  'gender',
  'dateOfBirth',
  'profileImage',
  'createdAt',
];

// @desc Get logged-in patient profile
const getProfile = async (req, res, next) => {
  try {
    res.json(pick(req.patient.toObject(), PROFILE_FIELDS));
  } catch (err) {
    next(err);
  }
};

// @desc Update logged-in patient profile
const updateProfile = async (req, res, next) => {
  try {
    const updates = pick(req.body, UPDATABLE_FIELDS);

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.patient._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(pick(updatedPatient.toObject(), PROFILE_FIELDS));
  } catch (err) {
    next(err);
  }
};

// @desc Delete logged-in patient profile
const deleteProfile = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.patient._id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
};
