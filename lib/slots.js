/**
 * Slot generation. Pure functions — no database, no clock of their own — so
 * the booking rules can be tested directly.
 *
 * All times are UTC. See the note on the Appointment model.
 */

const MINUTES = 60 * 1000;

/** "09:30" -> 570. Returns null if malformed. */
const parseHHMM = (value) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(String(value ?? ''));
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
};

/** "2026-09-20" -> Date at UTC midnight. Returns null if malformed. */
const parseDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Every slot a doctor's weekly availability implies for one date.
 *
 * A window that does not divide evenly by the slot length yields whole slots
 * only; the remainder is dropped rather than producing a short consultation.
 */
function generateSlots({ availability = [], slotMinutes = 30, date }) {
  const day = parseDate(date);
  if (!day) throw new Error('date must be YYYY-MM-DD');
  if (!Number.isFinite(slotMinutes) || slotMinutes <= 0) {
    throw new Error('slotMinutes must be a positive number');
  }

  const dayOfWeek = day.getUTCDay();
  const slots = [];

  for (const window of availability) {
    if (window.dayOfWeek !== dayOfWeek) continue;

    const start = parseHHMM(window.startTime);
    const end = parseHHMM(window.endTime);
    if (start === null || end === null || end <= start) continue;

    for (let offset = start; offset + slotMinutes <= end; offset += slotMinutes) {
      const startsAt = new Date(day.getTime() + offset * MINUTES);
      slots.push({
        startsAt,
        endsAt: new Date(startsAt.getTime() + slotMinutes * MINUTES),
      });
    }
  }

  // Overlapping availability windows could produce the same instant twice.
  const seen = new Set();
  return slots
    .filter((slot) => {
      const key = slot.startsAt.getTime();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => a.startsAt - b.startsAt);
}

/**
 * Remove slots that are already taken or in the past.
 *
 * This is for *display*. It is not what prevents double-booking — the unique
 * index on the Appointment collection does that. Treating this as the
 * safeguard would reintroduce the read-then-write race.
 */
function availableSlots({ slots, takenStartTimes = [], now = new Date() }) {
  const taken = new Set(takenStartTimes.map((t) => new Date(t).getTime()));
  return slots.filter(
    (slot) => !taken.has(slot.startsAt.getTime()) && slot.startsAt > now
  );
}

module.exports = { generateSlots, availableSlots, parseHHMM, parseDate };
