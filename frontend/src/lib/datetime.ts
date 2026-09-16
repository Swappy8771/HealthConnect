/**
 * Appointment times are UTC end to end — the backend interprets a doctor's
 * "HH:MM" availability as UTC and there is no per-clinic timezone yet.
 *
 * So these format in UTC and say so. Rendering local time would show a
 * different clock face from the one the doctor entered, which is worse than
 * showing UTC plainly until timezones are supported.
 */

const TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC",
});

const DATE = new Intl.DateTimeFormat("en-GB", {
  weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
});

export const formatTime = (value: string | Date) => TIME.format(new Date(value));
export const formatDate = (value: string | Date) => DATE.format(new Date(value));
export const formatDateTime = (value: string | Date) =>
  `${formatDate(value)}, ${formatTime(value)} UTC`;

/** YYYY-MM-DD in UTC — the format the slots endpoint expects. */
export const toDateInput = (value: Date) => value.toISOString().slice(0, 10);

export const addDays = (value: Date, days: number) => {
  const next = new Date(value);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
};

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
