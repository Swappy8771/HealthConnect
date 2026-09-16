// models/Patient.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { emailField } = require('./validators');

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: emailField(),
  phone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' }, // Path or URL to profile picture
  dateOfBirth: { type: Date },

  // Health form fields
  age: { type: Number },
  bloodGroup: { type: String },
  emergencyContactName: { type: String },
  emergencyContactPhone: { type: String },
  medication: { type: String },
  chronicDiseases: { type: String },
  allergies: { type: String },
  surgeries: { type: String },
  smoking: { type: String, enum: ['Yes', 'No'], default: 'No' },
  alcohol: { type: String, enum: ['Yes', 'No'], default: 'No' },
  activityLevel: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Moderate' },
  sleepHours: { type: Number }

}, { timestamps: true });


// Hash the password whenever it is set or changed. This is the single place
// hashing happens — routes assign the plaintext and save. Note that
// findByIdAndUpdate does NOT run this hook, which is why `password` is excluded
// from every update whitelist.
patientSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
