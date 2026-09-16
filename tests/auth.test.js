const test = require('node:test');
const assert = require('node:assert/strict');

const PORT = 5900 + (process.pid % 90);
process.env.JWT_SECRET = 'test-secret';
process.env.PORT = String(PORT);
process.env.NODE_ENV = 'test';
const { TEST_URI } = require('./helpers');
process.env.MONGO_URI = TEST_URI;

const mongoose = require('mongoose');
const { connect, teardown, clearCollections } = require('./helpers');

require.cache[require.resolve('../config/db.js')] = {
  id: require.resolve('../config/db.js'),
  filename: require.resolve('../config/db.js'),
  loaded: true,
  exports: async () => mongoose.connection,
};
require('../index.js');

const base = `http://127.0.0.1:${PORT}`;
const post = async (path, body) => {
  const res = await fetch(base + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let json = null;
  try { json = await res.json(); } catch { /* none */ }
  return { status: res.status, body: json };
};

test.before(async () => { await connect(); await new Promise((r) => setTimeout(r, 300)); });
test.beforeEach(async () => { await clearCollections(); });
test.after(async () => { await teardown(); process.exit(0); });

// Every login route should answer the same way to a missing credential:
// a 400, without touching the database.
for (const route of ['/api/patient/login', '/api/doctor/login', '/api/admin/login']) {
  test(`${route} rejects an empty body with 400`, async () => {
    const r = await post(route, {});
    assert.equal(r.status, 400, `expected 400, got ${r.status}`);
    assert.match(r.body.message, /required/i);
  });

  test(`${route} rejects a missing password with 400`, async () => {
    const r = await post(route, { email: 'someone@example.com' });
    assert.equal(r.status, 400);
  });
}

test('patient login rejects unknown credentials with 401, not 400', async () => {
  const r = await post('/api/patient/login', { email: 'nobody@example.com', password: 'Passw0rd123' });
  assert.equal(r.status, 401);
  assert.match(r.body.message, /invalid email or password/i);
});

test('password policy applies at registration', async () => {
  const base = { fullName: 'A', email: 'a@b.co', phone: '1', gender: 'Male' };
  assert.equal((await post('/api/patient/register', { ...base, password: 'short' })).status, 400);
  assert.equal((await post('/api/patient/register', { ...base, password: 'alllowercase' })).status, 400);
  assert.equal((await post('/api/patient/register', { ...base, password: 'Passw0rd123' })).status, 201);
});
