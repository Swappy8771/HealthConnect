const mongoose = require('mongoose');

/**
 * A booked consultation slot.
 *
 * Time handling: `startsAt` and `endsAt` are absolute instants (UTC). The
 * doctor's weekly availability is expressed in wall-clock strings and is
 * currently interpreted as UTC too — there is no per-clinic timezone yet. That
 * is a deliberate simplification, recorded here so it is not mistaken for
 * working timezone support.
 */
const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
      index: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },

    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },

    status: {
      type: String,
      enum: ['booked', 'completed', 'cancelled', 'no-show'],
      default: 'booked',
      index: true,
    },

    consultationType: {
      type: String,
      enum: ['Online', 'Offline'],
      default: 'Offline',
    },

    // Copied from the doctor at booking time: the fee the patient agreed to,
    // which must not change if the doctor later edits their profile.
    fee: { type: Number, min: 0 },

    reason: { type: String, trim: true, maxlength: 500 },

    cancelledBy: { type: String, enum: ['patient', 'doctor', 'admin'] },
    cancelledAt: { type: Date },
    cancellationReason: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

/**
 * Double-booking is prevented by the database, not by a read.
 *
 * Checking "is this slot free?" and then inserting is a race: two requests can
 * both read "free" before either writes. A unique index makes the second write
 * fail instead, whatever the interleaving.
 *
 * `partialFilterExpression` limits uniqueness to live bookings, so cancelling
 * an appointment genuinely frees the slot for someone else.
 */
appointmentSchema.index(
  { doctor: 1, startsAt: 1 },
  { unique: true, partialFilterExpression: { status: 'booked' } }
);

// The same protection from the other side: one patient cannot hold two
// appointments at the same instant with different doctors.
appointmentSchema.index(
  { patient: 1, startsAt: 1 },
  { unique: true, partialFilterExpression: { status: 'booked' } }
);

// Listing a doctor's day.
appointmentSchema.index({ doctor: 1, startsAt: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
