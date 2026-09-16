// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const connectDB = require('./config/db'); // your existing DB connection file

const seedAdmin = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new Admin({
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: hashedPassword,
      role: 'super-admin',
      status: 'active',
    });

    await admin.save();
    console.log('✅ Dummy admin created successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
