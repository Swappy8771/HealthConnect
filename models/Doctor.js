const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dateOfBirth: { type: Date },

  password: { type: String, required: true },

  education: [{ type: String, required: true }],
  specialization: { type: String, required: true },
  
  // ✅ New Field: Category for broader classification
  category: {
    type: String,
    enum: [
      'General Medicine',
      'Surgery',
      'Dental',
      'Mental Health',
      'Alternative Medicine',
      'Pediatrics',
      'Orthopedics',
      'Others'
    ],
    default: 'General Medicine'
  },

  experience: { type: Number, min: 0, required: true },

  clinic: {
    name: { type: String },
    address: { type: String },
    consultationType: {
      type: String,
      enum: ['Online', 'Offline', 'Both'],
      default: 'Both'
    },
    consultationFee: { type: Number }
  },

  documents: {
    degrees: [{ type: String }],
    license: { type: String },
    idProof: { type: String }
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  adminRemarks: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
