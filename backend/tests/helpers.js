// Shared test setup: a throwaway database per run, dropped at the end.
const mongoose = require('mongoose');

const TEST_URI =
  process.env.TEST_MONGO_URI ||
  `mongodb://127.0.0.1:27017/clinic_test_${process.pid}_${Date.now()}`;

async function connect() {
  await mongoose.connect(TEST_URI);
  // Indexes are what enforce the booking rules, so they must exist before any
  // test runs — Mongoose builds them lazily otherwise.
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));
  return mongoose.connection;
}

async function teardown() {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}

async function clearCollections() {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}

/** Next occurrence of a weekday at a given UTC time, always in the future. */
function nextWeekdayAt(dayOfWeek, hhmm, weeksAhead = 1) {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m));
  const delta = (dayOfWeek - date.getUTCDay() + 7) % 7;
  date.setUTCDate(date.getUTCDate() + delta + weeksAhead * 7);
  return date;
}

const isoDate = (d) => d.toISOString().slice(0, 10);

/**
 * Sign a token directly rather than logging in over HTTP.
 *
 * Tests need many sessions, and the login and register routes are rate limited
 * (deliberately). Going through them in setup would exhaust the limiter and
 * make tests fail for a reason unrelated to what they assert. The auth routes
 * themselves are covered by their own tests.
 */
const jwt = require('jsonwebtoken');

const CLAIM = { patient: 'patientId', doctor: 'doctorId', admin: 'adminId' };

function tokenFor(actor, id) {
  return jwt.sign({ [CLAIM[actor]]: String(id) }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = {
  connect, teardown, clearCollections, nextWeekdayAt, isoDate, tokenFor, TEST_URI,
};
