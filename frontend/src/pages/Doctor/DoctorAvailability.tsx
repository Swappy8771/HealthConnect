import React, { useEffect, useState } from "react";
import { getAvailability, saveAvailability } from "../../services/appointmentService";
import type { AvailabilityWindow } from "../../services/types";
import { Button } from "../../components/ui/Button";
import { DAY_NAMES } from "../../lib/datetime";

const BLANK: AvailabilityWindow = { dayOfWeek: 1, startTime: "09:00", endTime: "13:00" };

const DoctorAvailability: React.FC = () => {
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [slotMinutes, setSlotMinutes] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    getAvailability()
      .then((data) => {
        setWindows(data.availability ?? []);
        setSlotMinutes(data.slotMinutes ?? 30);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load availability"))
      .finally(() => setLoading(false));
  }, []);

  const update = (index: number, patch: Partial<AvailabilityWindow>) =>
    setWindows((prev) => prev.map((w, i) => (i === index ? { ...w, ...patch } : w)));

  const remove = (index: number) => setWindows((prev) => prev.filter((_, i) => i !== index));

  const save = async () => {
    setError(null);
    setNotice(null);

    const invalid = windows.find((w) => w.endTime <= w.startTime);
    if (invalid) {
      setError(`${DAY_NAMES[invalid.dayOfWeek]}: the end time must be after the start time.`);
      return;
    }

    setSaving(true);
    try {
      const saved = await saveAvailability({ availability: windows, slotMinutes });
      setWindows(saved.availability ?? []);
      setSlotMinutes(saved.slotMinutes);
      setNotice("Availability saved. Patients can book these slots.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save availability");
    } finally {
      setSaving(false);
    }
  };

  const slotsPerWindow = (w: AvailabilityWindow) => {
    const [sh, sm] = w.startTime.split(":").map(Number);
    const [eh, em] = w.endTime.split(":").map(Number);
    const minutes = eh * 60 + em - (sh * 60 + sm);
    return minutes > 0 ? Math.floor(minutes / slotMinutes) : 0;
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900">Availability</h1>
      <p className="mt-1 text-sm text-gray-500">
        Weekly hours you accept appointments. Repeats every week.{" "}
        <strong>Times are UTC</strong> — per-clinic time zones are not supported yet.
      </p>

      {error && (
        <p className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      {notice && (
        <p className="mt-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>
      )}

      <div className="mt-5 rounded-lg bg-white p-6 shadow-sm">
        <label className="block max-w-xs">
          <span className="text-sm font-medium text-gray-700">Appointment length</span>
          <select
            value={slotMinutes}
            onChange={(e) => setSlotMinutes(Number(e.target.value))}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
          >
            {[10, 15, 20, 30, 45, 60].map((m) => (
              <option key={m} value={m}>{m} minutes</option>
            ))}
          </select>
        </label>

        <div className="mt-6 space-y-3">
          {windows.length === 0 && (
            <p className="rounded border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
              No hours set, so no one can book yet. Add a window below.
            </p>
          )}

          {windows.map((w, i) => (
            <div key={i} className="flex flex-wrap items-end gap-3 rounded border border-gray-200 p-3">
              <label className="block">
                <span className="text-xs text-gray-500">Day</span>
                <select
                  value={w.dayOfWeek}
                  onChange={(e) => update(i, { dayOfWeek: Number(e.target.value) })}
                  className="mt-1 block rounded border border-gray-300 px-3 py-2 text-sm"
                >
                  {DAY_NAMES.map((name, index) => (
                    <option key={name} value={index}>{name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">From</span>
                <input type="time" value={w.startTime}
                  onChange={(e) => update(i, { startTime: e.target.value })}
                  className="mt-1 block rounded border border-gray-300 px-3 py-2 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">To</span>
                <input type="time" value={w.endTime}
                  onChange={(e) => update(i, { endTime: e.target.value })}
                  className="mt-1 block rounded border border-gray-300 px-3 py-2 text-sm" />
              </label>
              <span className="pb-2 text-sm text-gray-500">
                {slotsPerWindow(w)} slot{slotsPerWindow(w) === 1 ? "" : "s"}
              </span>
              <Button size="sm" variant="ghost" className="ml-auto text-red-600 hover:bg-red-50"
                onClick={() => remove(i)}>
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-3">
          <Button variant="secondary" onClick={() => setWindows((prev) => [...prev, { ...BLANK }])}>
            + Add hours
          </Button>
          <Button onClick={save} loading={saving}>Save availability</Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorAvailability;
