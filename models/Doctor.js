const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { emailField } = require('./validators');

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: emailField(),
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

  // Weekly recurring availability. Times are "HH:MM" wall clock, interpreted
  // as UTC for now (see the note on the Appointment model).
  availability: [{
    _id: false,
    dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    startTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    endTime:   { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  }],

  // Length of one consultation slot, in minutes.
  slotMinutes: { type: Number, min: 5, max: 240, default: 30 },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    // Both the admin queue and the patient listing filter on this.
    index: true
  },

  // Who last changed `status`, and when. Approval is a compliance-sensitive
  // action and `updatedAt` alone does not say who acted.
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt: { type: Date },

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
