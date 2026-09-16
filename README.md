# Clinic booking — backend

Express 5 + Mongoose 8 API for the clinic booking app. Three actors —
patient, doctor and admin — each with their own collection, login route and
JWT. The frontend lives in `../clinic-booking-app`.

## Setup

```bash
npm install
cp .env.example .env    # then fill in the values
npm run dev             # nodemon, http://localhost:5000
```

### Environment

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URI` | yes | The server exits at boot without it |
| `JWT_SECRET` | yes | Also required; there is no insecure default |
| `PORT` | no | Defaults to `5000` |
| `ALLOWED_ORIGINS` | no | Comma-separated; defaults to `http://localhost:5173` |

`config/env.js` validates these at startup and exits naming whatever is
missing.

### Creating the first admin

There is no admin signup route.

```bash
ADMIN_EMAIL=you@example.com npm run seed:admin
```

`ADMIN_PASSWORD` is optional — omit it and a strong one is generated and
printed once. Re-running is safe; an existing admin with that email is left
alone.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | nodemon with reload |
| `npm start` | plain node |
| `npm run lint` | ESLint 9 |
| `npm run seed:admin` | create the first admin |

## Layout

```
index.js          route mounting, CORS, health check, graceful shutdown
config/env.js     loads and validates .env — require this, not process.env
config/db.js      Mongoose connection
middlewares/      auth guards, rate limiting, request logging, error handling
models/           Patient, Doctor, Admin + shared validators
routes/           grouped by actor
controllers/      handlers with real logic (thin queries stay inline)
```

## Things to know before changing code

- **Passwords are hashed by `pre('save')` hooks on the models.** Never call
  `bcrypt.hash` at a call site — it would double-hash and break login.
  `findByIdAndUpdate` does not run those hooks, which is why `password` is
  excluded from every update whitelist.
- **Updates use explicit field whitelists.** Passing `req.body` straight into
  an update is how a patient could once overwrite their own password hash.
- **Three routers share the `/api/patient` prefix** and are matched in
  registration order. Check `index.js` before adding a route there.
- **A doctor cannot log in until an admin sets `status: 'approved'`.** That
  gate is the core of the product.
- Errors go to the central handler via `next(err)`; `err.message` is only
  returned to the client outside production.

The full architecture notes, module guides and the outstanding-issues audit
live in `~/Desktop/Personal/knowledge/clinic-booking/`.

## Tests

```bash
npm test          # node --test tests/*.test.js
```

Requires a MongoDB the tests can write to. They create a uniquely-named
database per run and drop it afterwards, so an existing local instance is
fine:

```bash
TEST_MONGO_URI=mongodb://127.0.0.1:27017/clinic_test npm test
```

Defaults to `mongodb://127.0.0.1:27017/clinic_test_<pid>_<timestamp>`.

| File | Covers |
|---|---|
| `tests/slots.test.js` | Slot generation — pure, no database |
| `tests/appointments.test.js` | Booking rules at the model layer, including concurrency |
| `tests/booking-api.test.js` | The booking endpoints over HTTP |

Fixtures are created directly through the models and tokens are signed with
`tokenFor()`, rather than going through register and login — those routes are
rate limited on purpose, and driving them in setup would exhaust the limiter
and fail tests for an unrelated reason.

**The test that matters most** is "50 simultaneous bookings for one slot
produce exactly one appointment". Double-booking is prevented by a partial
unique index on `(doctor, startsAt)` where `status: 'booked'` — not by checking
whether a slot is free and then inserting, which is a race. The partial filter
is what lets a cancelled appointment genuinely free its slot.
