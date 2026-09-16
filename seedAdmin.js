// seedAdmin.js
//
// Creates the first admin account. There is no admin signup route, so this is
// the only way an admin comes into existence.
//
//   ADMIN_EMAIL=you@example.com node seedAdmin.js
//
// Credentials are never hardcoded. ADMIN_EMAIL is required; ADMIN_PASSWORD is
// optional and a strong one is generated and printed once if you omit it.
// Re-running is safe: an existing admin with that email is left untouched.

const crypto = require('crypto');
const mongoose = require('mongoose');

require('./config/env');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');

const MIN_PASSWORD_LENGTH = 12;

const generatePassword = () =>
  crypto.randomBytes(18).toString('base64url').slice(0, 24);

const seedAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const name = (process.env.ADMIN_NAME || 'Super Admin').trim();

  if (!email) {
    console.error('❌ ADMIN_EMAIL is required.');
    console.error('   Usage: ADMIN_EMAIL=you@example.com node seedAdmin.js');
    process.exit(1);
  }

  const providedPassword = process.env.ADMIN_PASSWORD;
  if (providedPassword && providedPassword.length < MIN_PASSWORD_LENGTH) {
    console.error(`❌ ADMIN_PASSWORD must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    process.exit(1);
  }

  const password = providedPassword || generatePassword();
  const generated = !providedPassword;

  try {
    await connectDB();

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log(`ℹ️  An admin with ${email} already exists — nothing to do.`);
      console.log('   To reset its password, delete the document and re-run.');
      await mongoose.connection.close();
      process.exit(0);
    }

    await Admin.create({
      name,
      email,
      password, // hashed by the pre('save') hook on the model
      role: 'super-admin',
      status: 'active',
    });

    console.log('✅ Admin created.');
    console.log(`   email: ${email}`);
    if (generated) {
      console.log(`   password: ${password}`);
      console.log('   ⚠️  This is shown once and is not stored anywhere. Save it now.');
    } else {
      console.log('   password: (the ADMIN_PASSWORD you supplied)');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
