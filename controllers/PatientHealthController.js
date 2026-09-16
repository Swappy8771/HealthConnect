const Patient = require('../models/Patient');

const getHealthData = async (req, res) => {
  try {
    const patient = await Patient.findById(req.patient._id).select(
      'age bloodGroup emergencyContactName emergencyContactPhone medication chronicDiseases allergies surgeries smoking alcohol activityLevel sleepHours'
    );
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch health data', error: err.message });
  }
};

const updateHealthData = async (req, res) => {
  try {
    const healthFields = {
      age,
      bloodGroup,
      emergencyContactName,
      emergencyContactPhone,
      medication,
      chronicDiseases,
      allergies,
      surgeries,
      smoking,
      alcohol,
      activityLevel,
      sleepHours
    } = req.body;

    const updated = await Patient.findByIdAndUpdate(
      req.patient._id,
      { ...healthFields },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Health update failed', error: err.message });
  }
};

module.exports = {
  getHealthData,
  updateHealthData
};
