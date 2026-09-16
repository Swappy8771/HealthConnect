const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Loads and validates .env — exits if MONGO_URI or JWT_SECRET is missing
const { PORT, ALLOWED_ORIGINS } = require('./config/env');
const connectDB = require('./config/db');
const requestLogger = require('./middlewares/requestLogger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

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
app.use(requestLogger);

// Health check. Reports the real connection state rather than asserting it:
// readyState 1 is connected.
app.get('/', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : 'disconnected',
    uptime: process.uptime(),
  });
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
// Three routers share the /api/patient prefix and are tried in registration
// order: patientAuth owns /register and /login, patientProfile owns /me, and
// doctorListing owns /doctors and /doctors-by-category. Adding a path that
// collides with one of those would be shadowed silently rather than erroring —
// check this list before introducing a new /api/patient route.
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

// Fallback 404, then the central error handler. Both must come last.
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Finish in-flight requests and close the DB connection before exiting, so a
// restart or deploy does not drop live requests.
const shutdown = (signal) => async () => {
  console.log(`\n${signal} received, shutting down...`);
  server.close(async () => {
    await mongoose.connection.close();
    console.log('Closed server and database connection.');
    process.exit(0);
  });
  // Do not hang forever on a stuck connection.
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', shutdown('SIGTERM'));
process.on('SIGINT', shutdown('SIGINT'));

module.exports = app;
