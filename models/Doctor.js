const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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


// Hash the password whenever it is set or changed. This is the single place
// hashing happens — routes assign the plaintext and save. Note that
// findByIdAndUpdate does NOT run this hook, which is why `password` is excluded
// from every update whitelist.
doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Doctor', doctorSchema);
