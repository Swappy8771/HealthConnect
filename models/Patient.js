// models/Patient.js

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
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

module.exports = mongoose.model('Patient', patientSchema);
