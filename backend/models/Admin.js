const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { emailField } = require('./validators');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
    },

    email: emailField(),

    // No minlength here: the schema only ever sees the bcrypt hash, which is
    // always 60 characters, so the rule would always pass. Plaintext length is
    // checked by validatePassword() before the value is assigned.
    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    role: {
      type: String,
      enum: ['super-admin', 'verification-admin', 'support-admin'],
      default: 'support-admin',
    },

    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  { timestamps: true }
);


// Hash the password whenever it is set or changed. This is the single place
// hashing happens — routes assign the plaintext and save. Note that
// findByIdAndUpdate does NOT run this hook, which is why `password` is excluded
// from every update whitelist.
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
