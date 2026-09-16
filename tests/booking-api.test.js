const test = require('node:test');
const assert = require('node:assert/strict');

const PORT = 5700 + (process.pid % 200);
process.env.JWT_SECRET = 'test-secret';
process.env.PORT = String(PORT);
process.env.NODE_ENV = 'test';
const { TEST_URI } = require('./helpers');
process.env.MONGO_URI = TEST_URI;

const mongoose = require('mongoose');
const { connect, teardown, clearCollections, nextWeekdayAt, isoDate, tokenFor } = require('./helpers');

// Stub the connector so index.js does not open a second connection.
require.cache[require.resolve('../config/db.js')] = {
  id: require.resolve('../config/db.js'),
  filename: require.resolve('../config/db.js'),
  loaded: true,
  exports: async () => mongoose.connection,
};
require('../index.js');

const base = `http://127.0.0.1:${PORT}`;
const api = async (path, { method = 'GET', body, token } = {}) => {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* no body */ }
  return { status: res.status, body: json };
};

const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

let doctorToken, patientToken, doctorId, slotTime;

test.before(async () => {
  await connect();
  await new Promise((r) => setTimeout(r, 400));
});

test.beforeEach(async () => {
  await clearCollections();
  slotTime = nextWeekdayAt(3, '10:00');

  const doc = await Doctor.create({
    fullName: 'Dr API', email: 'dr@api.io', phone: '1', gender: 'Male',
    password: 'Passw0rd123', specialization: 'Cardiology', experience: 4, education: ['MBBS'],
    status: 'approved', slotMinutes: 30,
    availability: [{ dayOfWeek: 3, startTime: '10:00', endTime: '12:00' }],
    clinic: { name: 'C', consultationType: 'Both', consultationFee: 400 },
  });
  doctorId = doc._id.toString();
  doctorToken = tokenFor('doctor', doc._id);

  const pat = await Patient.create({
    fullName: 'Pat', email: 'pat@api.io', phone: '2', gender: 'Female', password: 'Passw0rd123' });
  patientToken = tokenFor('patient', pat._id);
});

test.after(async () => { await teardown(); process.exit(0); });

test('availability round-trips for an approved doctor', async () => {
  const r = await api('/api/doctor/availability', { token: doctorToken });
  assert.equal(r.status, 200);
  assert.equal(r.body.slotMinutes, 30);
  assert.equal(r.body.availability[0].startTime, '10:00');
});

test('availability rejects an inverted window', async () => {
  const r = await api('/api/doctor/availability', { method: 'PUT', token: doctorToken,
    body: { availability: [{ dayOfWeek: 3, startTime: '12:00', endTime: '10:00' }] } });
  assert.equal(r.status, 400);
  assert.match(r.body.message, /endTime must be after startTime/);
});

test('doctor endpoints require a doctor token', async () => {
  assert.equal((await api('/api/doctor/availability')).status, 401);
  assert.equal((await api('/api/doctor/availability', { token: patientToken })).status, 401);
});

test('a patient sees open slots and they shrink once booked', async () => {
  let r = await api(`/api/patient/doctors/${doctorId}/slots?date=${isoDate(slotTime)}`, { token: patientToken });
  assert.equal(r.status, 200);
  assert.equal(r.body.slots.length, 4);
  assert.equal(r.body.fee, 400);

  r = await api('/api/patient/appointments', { method: 'POST', token: patientToken,
    body: { doctorId, startsAt: slotTime.toISOString(), reason: 'Check-up' } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  assert.equal(r.body.appointment.fee, 400, 'fee is snapshotted at booking');

  r = await api(`/api/patient/doctors/${doctorId}/slots?date=${isoDate(slotTime)}`, { token: patientToken });
  assert.equal(r.body.slots.length, 3);
});

test('a slot outside published availability is refused', async () => {
  const offGrid = new Date(slotTime.getTime() + 7 * 60000); // 10:07, not on the grid
  const r = await api('/api/patient/appointments', { method: 'POST', token: patientToken,
    body: { doctorId, startsAt: offGrid.toISOString() } });
  assert.equal(r.status, 400);
  assert.match(r.body.message, /not offered/);
});

test('a slot in the past is refused', async () => {
  const r = await api('/api/patient/appointments', { method: 'POST', token: patientToken,
    body: { doctorId, startsAt: '2020-01-01T10:00:00.000Z' } });
  assert.equal(r.status, 400);
  assert.match(r.body.message, /past/);
});

test('booking the same slot twice returns 409, not 500', async () => {
  await api('/api/patient/appointments', { method: 'POST', token: patientToken,
    body: { doctorId, startsAt: slotTime.toISOString() } });

  const other = tokenFor('patient', (await Patient.create({
    fullName: 'Pat2', email: 'pat2@api.io', phone: '3', gender: 'Male', password: 'Passw0rd123' }))._id);

  const r = await api('/api/patient/appointments', { method: 'POST', token: other,
    body: { doctorId, startsAt: slotTime.toISOString() } });
  assert.equal(r.status, 409, JSON.stringify(r.body));
  assert.equal(r.body.code, 'SLOT_TAKEN');
});

test('cancelling frees the slot over HTTP', async () => {
  const booked = await api('/api/patient/appointments', { method: 'POST', token: patientToken,
    body: { doctorId, startsAt: slotTime.toISOString() } });

  const r = await api(`/api/patient/appointments/${booked.body.appointment._id}/cancel`,
    { method: 'PATCH', token: patientToken, body: { reason: 'Changed plans' } });
  assert.equal(r.status, 200);
  assert.equal(r.body.appointment.status, 'cancelled');
  assert.equal(r.body.appointment.cancelledBy, 'patient');

  const slots = await api(`/api/patient/doctors/${doctorId}/slots?date=${isoDate(slotTime)}`, { token: patientToken });
  assert.equal(slots.body.slots.length, 4, 'the slot is offered again');
});

test('cancelling twice is refused', async () => {
  const booked = await api('/api/patient/appointments', { method: 'POST', token: patientToken,
    body: { doctorId, startsAt: slotTime.toISOString() } });
  const id = booked.body.appointment._id;
  await api(`/api/patient/appointments/${id}/cancel`, { method: 'PATCH', token: patientToken });
  const r = await api(`/api/patient/appointments/${id}/cancel`, { method: 'PATCH', token: patientToken });
  assert.equal(r.status, 409);
  assert.match(r.body.message, /already cancelled/);
});

test('a patient cannot cancel someone else\'s appointment', async () => {
  const booked = await api('/api/patient/appointments', { method: 'POST', token: patientToken,
    body: { doctorId, startsAt: slotTime.toISOString() } });

  const other = tokenFor('patient', (await Patient.create({
    fullName: 'Pat3', email: 'pat3@api.io', phone: '4', gender: 'Male', password: 'Passw0rd123' }))._id);

  const r = await api(`/api/patient/appointments/${booked.body.appointment._id}/cancel`,
    { method: 'PATCH', token: other });
  assert.equal(r.status, 404, 'must not reveal that it exists');
  assert.equal(await Appointment.countDocuments({ status: 'booked' }), 1);
});

test('each side lists its own appointments', async () => {
  await api('/api/patient/appointments', { method: 'POST', token: patientToken,
    body: { doctorId, startsAt: slotTime.toISOString() } });

  const mine = await api('/api/patient/appointments', { token: patientToken });
  assert.equal(mine.body.length, 1);
  assert.equal(mine.body[0].doctor.fullName, 'Dr API');

  const theirs = await api(`/api/doctor/appointments?date=${isoDate(slotTime)}`, { token: doctorToken });
  assert.equal(theirs.body.length, 1);
  assert.equal(theirs.body[0].patient.fullName, 'Pat');
});

test('an unapproved doctor loses access immediately', async () => {
  await Doctor.updateOne({ _id: doctorId }, { status: 'rejected' });
  const r = await api('/api/doctor/appointments', { token: doctorToken });
  assert.equal(r.status, 403, 'requireApprovedDoctor should reject a still-valid token');
  assert.equal(r.body.status, 'rejected');
});
