const express = require('express');
const cors = require('cors');

// Loads and validates .env — exits if MONGO_URI or JWT_SECRET is missing
const { PORT, ALLOWED_ORIGINS } = require('./config/env');
const connectDB = require('./config/db');

// Connect to DB
connectDB();

// Initialize app
const app = express();

// Middleware
// Only the configured origins may call the API. Requests with no Origin header
// (curl, server-to-server, health checks) are allowed through.
app.use(cors({
  origin: (origin, callback) => {
    // Deny by omitting the CORS header rather than raising — an error here
    // would surface as a 500 with a stack trace instead of a clean block.
    callback(null, !origin || ALLOWED_ORIGINS.includes(origin));
  },
}));
app.use(express.json());

// Root test route
app.get('/', (req, res) => {
  res.status(200).send('🟢 Server is running and DB is connected!');
});

// Route imports
const patientAuthRoutes = require('./routes/patientAuth');
const patientProfileRoutes = require('./routes/patient/PatientProfile');
const patientHealthFormRoutes = require('./routes/patient/PatientHealthForm');
const doctorListingRoutes = require('./routes/patient/doctorListing');

const doctorAuthRoutes = require('./routes/doctorAuth');
// const doctorProfileRoutes = require('./routes/doctor/DoctorProfile'); // optional

const adminAuthRoutes = require('./routes/adminAuth');
const adminDoctorRoutes = require('./routes/admin/doctorRequests'); // ✅ admin doctor requests

// Use Routes

// Patient routes
app.use('/api/patient', patientAuthRoutes);
app.use('/api/patient', patientProfileRoutes);
app.use('/api/patient/healthform', patientHealthFormRoutes);
app.use('/api/patient', doctorListingRoutes);

// Doctor routes
app.use('/api/doctor', doctorAuthRoutes);
// app.use('/api/doctor/profile', doctorProfileRoutes); // optional

// Admin routes
app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/doctors', adminDoctorRoutes); // ✅ All doctor management endpoints under /api/admin/doctors

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ message: '🔴 Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
