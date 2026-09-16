const test = require('node:test');
const assert = require('node:assert/strict');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placeholder';

const { connect, teardown, clearCollections, nextWeekdayAt, isoDate } = require('./helpers');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

let doctor, patientA, patientB, slotTime;

test.before(async () => {
  await connect();
});

test.beforeEach(async () => {
  await clearCollections();

  // A Wednesday slot, comfortably in the future.
  slotTime = nextWeekdayAt(3, '10:00');

  doctor = await Doctor.create({
    fullName: 'Dr Test', email: 'dr@test.io', phone: '1', gender: 'Male',
    password: 'Passw0rd123', education: ['MBBS'], specialization: 'Cardiology',
    experience: 5, status: 'approved', slotMinutes: 30,
    availability: [{ dayOfWeek: 3, startTime: '10:00', endTime: '12:00' }],
    clinic: { name: 'Test Clinic', consultationType: 'Both', consultationFee: 400 },
  });

  [patientA, patientB] = await Promise.all([
    Patient.create({ fullName: 'A', email: 'a@test.io', phone: '1', gender: 'Female', password: 'Passw0rd123' }),
    Patient.create({ fullName: 'B', email: 'b@test.io', phone: '2', gender: 'Male', password: 'Passw0rd123' }),
  ]);
});

test.after(async () => {
  await teardown();
});

const booking = (patient, when = slotTime, extra = {}) => ({
  patient: patient._id,
  doctor: doctor._id,
  startsAt: when,
  endsAt: new Date(when.getTime() + 30 * 60000),
  ...extra,
});

test('a slot can be booked once', async () => {
  const appt = await Appointment.create(booking(patientA));
  assert.equal(appt.status, 'booked');
  assert.equal(await Appointment.countDocuments({ status: 'booked' }), 1);
});

test('the same doctor slot cannot be booked twice', async () => {
  await Appointment.create(booking(patientA));
  await assert.rejects(
    () => Appointment.create(booking(patientB)),
    (err) => err.code === 11000,
    'the unique index should reject the second booking'
  );
});

test('50 simultaneous bookings for one slot produce exactly one appointment', async () => {
  // The real guarantee. A read-then-write check would let several through
  // here, because they all read "free" before any of them wrote.
  const patients = await Patient.create(
    Array.from({ length: 50 }, (_, i) => ({
      fullName: `P${i}`, email: `p${i}@test.io`, phone: `${i}`,
      gender: 'Other', password: 'Passw0rd123',
    }))
  );

  const results = await Promise.allSettled(
    patients.map((p) => Appointment.create(booking(p)))
  );

  const won = results.filter((r) => r.status === 'fulfilled');
  const lost = results.filter((r) => r.status === 'rejected');

  assert.equal(won.length, 1, `expected exactly 1 winner, got ${won.length}`);
  assert.equal(lost.length, 49);
  assert.ok(lost.every((r) => r.reason.code === 11000), 'all losers should be duplicate-key');
  assert.equal(await Appointment.countDocuments({ status: 'booked' }), 1);
});

test('cancelling frees the slot for someone else', async () => {
  const first = await Appointment.create(booking(patientA));

  first.status = 'cancelled';
  first.cancelledBy = 'patient';
  first.cancelledAt = new Date();
  await first.save();

  // The unique index is partial on status:'booked', so a cancelled row does
  // not keep the slot reserved.
  const second = await Appointment.create(booking(patientB));
  assert.equal(second.status, 'booked');
  assert.equal(await Appointment.countDocuments({ startsAt: slotTime }), 2);
  assert.equal(await Appointment.countDocuments({ startsAt: slotTime, status: 'booked' }), 1);
});

test('a patient cannot hold two appointments at the same instant', async () => {
  const otherDoctor = await Doctor.create({
    fullName: 'Dr Two', email: 'dr2@test.io', phone: '9', gender: 'Female',
    password: 'Passw0rd123', education: ['MBBS'], specialization: 'Dermatology',
    experience: 3, status: 'approved', slotMinutes: 30,
    availability: [{ dayOfWeek: 3, startTime: '10:00', endTime: '12:00' }],
  });

  await Appointment.create(booking(patientA));
  await assert.rejects(
    () => Appointment.create({ ...booking(patientA), doctor: otherDoctor._id }),
    (err) => err.code === 11000
  );
});

test('different slots with the same doctor are independent', async () => {
  const later = new Date(slotTime.getTime() + 30 * 60000);
  await Appointment.create(booking(patientA));
  const second = await Appointment.create(booking(patientB, later));
  assert.equal(second.status, 'booked');
  assert.equal(await Appointment.countDocuments({ status: 'booked' }), 2);
});

test('the fee is snapshotted, not read live from the doctor', async () => {
  const appt = await Appointment.create(booking(patientA, slotTime, { fee: doctor.clinic.consultationFee }));
  await Doctor.updateOne({ _id: doctor._id }, { 'clinic.consultationFee': 9999 });

  const stored = await Appointment.findById(appt._id);
  assert.equal(stored.fee, 400, 'a later price change must not alter an agreed fee');
});

test('status is constrained to the known values', async () => {
  await assert.rejects(
    () => Appointment.create(booking(patientA, slotTime, { status: 'whatever' })),
    (err) => err.name === 'ValidationError' && /not a valid enum value/.test(err.message)
  );
});

test('the slot a doctor offers is derived from availability', async () => {
  const { generateSlots } = require('../lib/slots');
  const slots = generateSlots({
    availability: doctor.availability,
    slotMinutes: doctor.slotMinutes,
    date: isoDate(slotTime),
  });
  assert.equal(slots.length, 4); // 10:00-12:00 in 30-minute slots
  assert.ok(slots.some((s) => s.startsAt.getTime() === slotTime.getTime()));
});
