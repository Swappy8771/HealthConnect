# Clinic Booking App

A clinic appointment platform. Patients find verified doctors and book
consultations; doctors publish their availability and manage their day;
administrators verify doctor applications before they go live.

```
clinic-booking-app/
├── backend/     Express 5 + Mongoose 8 API  (see backend/README.md)
└── frontend/    React 19 + TypeScript + Vite
```

## Quick start

Two processes. Requires Node 20+ and a MongoDB instance.

```bash
# API — http://localhost:5000
cd backend
npm install
cp .env.example .env          # fill in MONGO_URI and JWT_SECRET
ADMIN_EMAIL=you@example.com npm run seed:admin
npm run dev

# Web — http://localhost:5173
cd frontend
npm install
cp .env.example .env
npm run dev
```

The API refuses to start without `MONGO_URI` and `JWT_SECRET` — there is no
insecure default.

## How it works

Three kinds of user, each with their own collection, login route and JWT.
Separation comes from the token claim: a patient token carries `patientId`, a
doctor token `doctorId`, an admin token `adminId`, and each guard requires its
own.

**Doctors cannot log in until an administrator approves them.** Registration
creates the account as `pending`; approval is what makes a doctor able to sign
in and visible to patients. That gate is the centre of the product.

**Booking is protected by the database, not by a check.** A partial unique
index on `(doctor, startsAt)` where `status: 'booked'` means two simultaneous
bookings for one slot cannot both succeed — asking "is this free?" and then
inserting is a race. The partial filter is what lets a cancelled appointment
free its slot again.

## Tests

```bash
cd backend && npm test      # 39 tests, node:test, throwaway database
```

The frontend has no tests yet.

## Known limitations

- **Appointment times are UTC throughout.** There is no per-clinic time zone;
  the UI labels times as UTC rather than showing a local clock face that would
  differ from what the doctor entered.
- Doctor documents are URLs typed by hand — there is no file upload.
- No notifications: a patient books and the doctor finds out by looking.
- No reschedule; cancel and rebook instead.

## Scripts

| Location | Command | Does |
|---|---|---|
| `backend` | `npm run dev` | API with reload |
| `backend` | `npm test` | Test suite |
| `backend` | `npm run lint` | ESLint |
| `backend` | `npm run seed:admin` | Create the first admin |
| `frontend` | `npm run dev` | Vite dev server |
| `frontend` | `npm run build` | Typecheck and production build |
| `frontend` | `npm run lint` | ESLint |
