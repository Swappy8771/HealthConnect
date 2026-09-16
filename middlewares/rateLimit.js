// Minimal fixed-window rate limiter.
//
// In-memory and therefore per-process: counters reset on restart and are not
// shared across instances. That is enough to blunt credential stuffing against
// a single-process deployment. If this ever runs behind more than one process,
// replace the store with Redis — the middleware signature need not change.

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const buckets = new Map();

// Drop expired buckets so the map cannot grow without bound.
const sweep = (now) => {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
};

let lastSweep = 0;

const rateLimit = ({ max = 10, windowMs = WINDOW_MS, name = 'default' } = {}) => {
  return (req, res, next) => {
    const now = Date.now();

    if (now - lastSweep > windowMs) {
      sweep(now);
      lastSweep = now;
    }

    const key = `${name}:${req.ip}`;
    let bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }

    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    res.set('X-RateLimit-Limit', String(max));
    res.set('X-RateLimit-Remaining', String(remaining));

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        message: `Too many attempts. Try again in ${Math.ceil(retryAfter / 60)} minute(s).`,
      });
    }

    next();
  };
};

// Tighter limit for credential endpoints; looser for everything else.
const loginLimiter = rateLimit({ max: 10, name: 'login' });
const registerLimiter = rateLimit({ max: 5, name: 'register' });

module.exports = { rateLimit, loginLimiter, registerLimiter };
