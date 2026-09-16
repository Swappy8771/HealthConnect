import React, { useCallback, useEffect, useState } from "react";
import { cancelDoctorAppointment, getDoctorAppointments } from "../../services/appointmentService";
import type { Appointment } from "../../services/types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { addDays, formatDate, formatTime, toDateInput } from "../../lib/datetime";

const DoctorAppointments: React.FC = () => {
  const [date, setDate] = useState(toDateInput(new Date()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [toCancel, setToCancel] = useState<Appointment | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAppointments(await getDoctorAppointments({ date }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load appointments");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { load(); }, [load]);

  const confirmCancel = async () => {
    if (!toCancel) return;
    setBusy(true);
    try {
      await cancelDoctorAppointment(toCancel._id, reason.trim() || undefined);
      setNotice("Appointment cancelled. The patient can see the reason.");
      setToCancel(null);
      setReason("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel");
    } finally {
      setBusy(false);
    }
  };

  const patientOf = (a: Appointment) =>
    typeof a.patient === "object" && a.patient !== null ? a.patient : null;

  const booked = appointments.filter((a) => a.status === "booked");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
      <p className="mt-1 text-sm text-gray-500">All times shown in UTC.</p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="text-sm text-gray-600">Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="mt-1 block rounded border border-gray-300 px-3 py-2" />
        </label>
        <Button variant="secondary" onClick={() => setDate(toDateInput(addDays(new Date(date), -1)))}>
          Previous
        </Button>
        <Button variant="secondary" onClick={() => setDate(toDateInput(new Date()))}>Today</Button>
        <Button variant="secondary" onClick={() => setDate(toDateInput(addDays(new Date(date), 1)))}>
          Next
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      {notice && (
        <p className="mt-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>
      )}

      <h2 className="mt-6 text-sm font-medium text-gray-700">
        {formatDate(`${date}T00:00:00Z`)} — {booked.length} booked
      </h2>

      {loading ? (
        <p className="mt-3 text-gray-500">Loading...</p>
      ) : appointments.length === 0 ? (
        <div className="mt-3 rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-600">
          Nothing booked on this date.
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {appointments.map((a) => {
            const patient = patientOf(a);
            return (
              <li key={a._id}
                className={`rounded-lg bg-white p-4 shadow-sm ${a.status !== "booked" ? "opacity-60" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-4">
                    <div className="w-28 shrink-0 font-mono text-sm text-gray-700">
                      {formatTime(a.startsAt)}–{formatTime(a.endsAt)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient?.fullName ?? "Patient"}</p>
                      <p className="text-sm text-gray-500">
                        {patient?.gender}
                        {patient?.phone ? ` · ${patient.phone}` : ""}
                      </p>
                      {a.reason && <p className="mt-1 text-sm text-gray-600">“{a.reason}”</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      {a.status}
                    </span>
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
          The patient will see this cancellation, and the slot becomes bookable again.
        </p>
        <label className="mt-3 block">
          <span className="text-sm text-gray-600">Reason (shown to the patient)</span>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} maxLength={500}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
        </label>
      </Modal>
    </div>
  );
};

export default DoctorAppointments;
