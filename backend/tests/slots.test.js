const test = require('node:test');
const assert = require('node:assert/strict');
const { generateSlots, availableSlots, parseHHMM, parseDate } = require('../lib/slots');

// 2026-09-20 is a Sunday (dayOfWeek 0).
const SUNDAY = '2026-09-20';
const at = (hhmm) => new Date(`${SUNDAY}T${hhmm}:00.000Z`);
const times = (slots) => slots.map((s) => s.startsAt.toISOString().slice(11, 16));

test('parseHHMM accepts valid times and rejects the rest', () => {
  assert.equal(parseHHMM('00:00'), 0);
  assert.equal(parseHHMM('09:30'), 570);
  assert.equal(parseHHMM('23:59'), 1439);
  for (const bad of ['24:00', '9:30', '09:60', 'ab:cd', '', null, undefined]) {
    assert.equal(parseHHMM(bad), null, `${bad} should be rejected`);
  }
});

test('parseDate accepts YYYY-MM-DD only', () => {
  assert.equal(parseDate('2026-09-20').toISOString(), '2026-09-20T00:00:00.000Z');
  for (const bad of ['20-09-2026', '2026/09/20', 'today', '', null]) {
    assert.equal(parseDate(bad), null, `${bad} should be rejected`);
  }
});

test('generates whole slots across an availability window', () => {
  const slots = generateSlots({
    availability: [{ dayOfWeek: 0, startTime: '09:00', endTime: '10:30' }],
    slotMinutes: 30,
    date: SUNDAY,
  });
  assert.deepEqual(times(slots), ['09:00', '09:30', '10:00']);
  assert.equal(slots[0].endsAt.toISOString(), at('09:30').toISOString());
});

test('drops the remainder rather than emitting a short slot', () => {
  const slots = generateSlots({
    availability: [{ dayOfWeek: 0, startTime: '09:00', endTime: '10:10' }],
    slotMinutes: 30,
    date: SUNDAY,
  });
  // 70 minutes fits two 30-minute slots; the trailing 10 minutes is not a slot.
  assert.deepEqual(times(slots), ['09:00', '09:30']);
});

test('ignores windows for other weekdays', () => {
  const slots = generateSlots({
    availability: [{ dayOfWeek: 3, startTime: '09:00', endTime: '17:00' }],
    slotMinutes: 30,
    date: SUNDAY, // a Sunday
  });
  assert.deepEqual(slots, []);
});

test('merges overlapping windows without emitting a duplicate instant', () => {
  const slots = generateSlots({
    availability: [
      { dayOfWeek: 0, startTime: '09:00', endTime: '10:00' },
      { dayOfWeek: 0, startTime: '09:30', endTime: '10:30' },
    ],
    slotMinutes: 30,
    date: SUNDAY,
  });
  assert.deepEqual(times(slots), ['09:00', '09:30', '10:00']);
});

test('skips malformed or inverted windows instead of throwing', () => {
  const slots = generateSlots({
    availability: [
      { dayOfWeek: 0, startTime: '17:00', endTime: '09:00' }, // inverted
      { dayOfWeek: 0, startTime: 'oops', endTime: '10:00' },  // malformed
      { dayOfWeek: 0, startTime: '11:00', endTime: '12:00' }, // valid
    ],
    slotMinutes: 60,
    date: SUNDAY,
  });
  assert.deepEqual(times(slots), ['11:00']);
});

test('rejects a bad date or slot length loudly', () => {
  assert.throws(() => generateSlots({ availability: [], slotMinutes: 30, date: 'nope' }), /YYYY-MM-DD/);
  assert.throws(() => generateSlots({ availability: [], slotMinutes: 0, date: SUNDAY }), /positive/);
});

test('availableSlots removes taken and past slots', () => {
  const slots = generateSlots({
    availability: [{ dayOfWeek: 0, startTime: '09:00', endTime: '11:00' }],
    slotMinutes: 30,
    date: SUNDAY,
  });
  const left = availableSlots({
    slots,
    takenStartTimes: [at('09:30'), at('10:30')],
    now: at('09:15'),
  });
  assert.deepEqual(times(left), ['10:00']);
});

test('availableSlots accepts date strings as well as Date objects', () => {
  const slots = generateSlots({
    availability: [{ dayOfWeek: 0, startTime: '09:00', endTime: '10:00' }],
    slotMinutes: 30,
    date: SUNDAY,
  });
  const left = availableSlots({
    slots,
    takenStartTimes: [at('09:00').toISOString()],
    now: new Date('2020-01-01'),
  });
  assert.deepEqual(times(left), ['09:30']);
});
