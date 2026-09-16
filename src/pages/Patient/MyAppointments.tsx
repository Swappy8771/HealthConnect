import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cancelMyAppointment, getMyAppointments } from "../../services/appointmentService";
import type { Appointment, AppointmentStatus } from "../../services/types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { formatDate, formatTime } from "../../lib/datetime";

type Filter = AppointmentStatus | "all";
const FILTERS: { label: string; value: Filter }[] = [
  { label: "Upcoming", value: "booked" },
  { label: "Cancelled", value: "cancelled" },
  { label: "All", value: "all" },
];

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  booked: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  "no-show": "bg-amber-50 text-amber-700 border-amber-200",
};

const MyAppointments: React.FC = () => {
  const location = useLocation() as { state?: { justBooked?: boolean } };
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>("booked");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    location.state?.justBooked ? "Appointment booked." : null
  );
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAppointments(await getMyAppointments(filter === "all" ? undefined : filter));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your appointments");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const confirmCancel = async () => {
    if (!toCancel) return;
    setBusy(true);
    try {
      await cancelMyAppointment(toCancel._id, reason.trim() || undefined);
      setNotice("Appointment cancelled. The slot is available again.");
      setToCancel(null);
      setReason("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel");
    } finally {
      setBusy(false);
    }
  };

  const doctorOf = (a: Appointment) =>
    typeof a.doctor === "object" && a.doctor !== null ? a.doctor : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">My appointments</h1>
      <p className="mt-1 text-sm text-gray-500">All times shown in UTC.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              filter === f.value
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      {notice && (
        <p className="mt-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>
      )}

      {loading ? (
        <p className="mt-6 text-gray-500">Loading...</p>
      ) : appointments.length === 0 ? (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-600">Nothing here yet.</p>
          <Link to="/landing/patient/doctors" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
            Find a doctor →
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {appointments.map((a) => {
            const doctor = doctorOf(a);
            return (
              <li key={a._id} className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {doctor?.fullName ?? "Doctor"}
                    </p>
                    <p className="text-sm text-gray-500">{doctor?.specialization}</p>
                    <p className="mt-2 text-sm text-gray-700">
                      {formatDate(a.startsAt)} · {formatTime(a.startsAt)}–{formatTime(a.endsAt)} UTC
                    </p>
                    {doctor?.clinic?.address && (
                      <p className="text-sm text-gray-500">{doctor.clinic.address}</p>
                    )}
                    {a.reason && <p className="mt-1 text-sm text-gray-600">“{a.reason}”</p>}
                    {a.status === "cancelled" && a.cancelledBy && (
                      <p className="mt-1 text-sm text-gray-500">
                        Cancelled by the {a.cancelledBy}
                        {a.cancellationReason ? ` — ${a.cancellationReason}` : ""}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                      {a.status}
                    </span>
                    {a.fee !== undefined && <span className="text-sm text-gray-600">₹{a.fee}</span>}
                    {a.status === "booked" && (
                      <Button size="sm" variant="secondary" onClick={() => setToCancel(a)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        open={Boolean(toCancel)}
        onClose={() => setToCancel(null)}
        title="Cancel this appointment?"
        className="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setToCancel(null)} disabled={busy}>Keep it</Button>
            <Button variant="danger" onClick={confirmCancel} loading={busy}>Cancel appointment</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          The slot becomes available to other patients. You can book again if it is still free.
        </p>
        <label className="mt-3 block">
          <span className="text-sm text-gray-600">Reason (optional)</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            maxLength={500}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
      </Modal>
    </div>
  );
};

export default MyAppointments;
