import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookAppointment, getDoctorSlots } from "../../services/appointmentService";
import type { Slot, SlotsResponse } from "../../services/types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Skeleton } from "../../components/ui/Skeleton";
import { addDays, formatDate, formatTime, toDateInput } from "../../lib/datetime";

const BookAppointment: React.FC = () => {
  const { doctorId = "" } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(toDateInput(addDays(new Date(), 1)));
  const [data, setData] = useState<SlotsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [chosen, setChosen] = useState<Slot | null>(null);
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getDoctorSlots(doctorId, date));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load slots");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  useEffect(() => { load(); }, [load]);

  const confirm = async () => {
    if (!chosen) return;
    setBooking(true);
    setError(null);
    try {
      await bookAppointment({ doctorId, startsAt: chosen.startsAt, reason: reason.trim() || undefined });
      navigate("/landing/patient/appointments", {
        replace: true,
        state: { justBooked: true },
      });
    } catch (err) {
      // 409 means someone took it between the page loading and this click —
      // refresh so the patient sees what is actually left.
      setError(err instanceof Error ? err.message : "Could not book that slot");
      setChosen(null);
      await load();
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-blue-600 hover:underline">
        ← Back to doctors
      </button>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900">
          Book with {data?.doctor ?? "doctor"}
        </h1>
        {data?.fee !== undefined && (
          <p className="mt-1 text-sm text-gray-600">
            Consultation fee ₹{data.fee}
            {data.slotMinutes ? ` · ${data.slotMinutes} minutes` : ""}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="text-sm text-gray-600">Date</span>
            <input
              type="date"
              value={date}
              min={toDateInput(new Date())}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block rounded border border-gray-300 px-3 py-2"
            />
          </label>
          <Button variant="secondary" onClick={() => setDate(toDateInput(addDays(new Date(date), -1)))}>
            Previous day
          </Button>
          <Button variant="secondary" onClick={() => setDate(toDateInput(addDays(new Date(date), 1)))}>
            Next day
          </Button>
        </div>

        {error && (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6">
          <h2 className="text-sm font-medium text-gray-700">
            {formatDate(`${date}T00:00:00Z`)} — times shown in UTC
          </h2>

          {loading ? (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : !data || data.slots.length === 0 ? (
            <p className="mt-3 rounded border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
              No open slots on this date. Try another day.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {data.slots.map((slot) => (
                <button
                  key={slot.startsAt}
                  onClick={() => setChosen(slot)}
                  className="rounded-md border border-blue-600 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                >
                  {formatTime(slot.startsAt)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={Boolean(chosen)}
        onClose={() => setChosen(null)}
        title="Confirm appointment"
        className="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setChosen(null)} disabled={booking}>Cancel</Button>
            <Button onClick={confirm} loading={booking}>Confirm booking</Button>
          </>
        }
      >
        {chosen && (
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>{data?.doctor}</strong><br />
              {formatDate(chosen.startsAt)} at {formatTime(chosen.startsAt)}–{formatTime(chosen.endsAt)} UTC
            </p>
            {data?.fee !== undefined && <p>Fee: ₹{data.fee}</p>}
            <label className="block">
              <span className="text-sm text-gray-600">Reason for visit (optional)</span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                maxLength={500}
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                placeholder="Briefly, what would you like to discuss?"
              />
            </label>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookAppointment;
