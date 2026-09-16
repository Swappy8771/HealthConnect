const Patient = require('../models/Patient');

// @desc Get logged-in patient profile
const getProfile = async (req, res) => {
  try {
    res.json(req.patient); 
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Update logged-in patient profile
const updateProfile = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.patient._id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedPatient);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
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
