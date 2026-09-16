import React, { useEffect, useState } from "react";
import { getHealthForm, updateHealthForm } from "../../services/patientService";
import type { HealthForm as HealthFormData } from "../../services/types";
import { Button } from "../../components/ui/Button";

// Only fields that GET /api/patient/healthform returns and PUT accepts.
// fullName, gender and phone are account fields — they live on the profile
// page. They used to appear here and only saved because of a mass-assignment
// bug in the controller; they never loaded back.
type FormState = Record<keyof HealthFormData, string>;

const defaultForm: FormState = {
  age: "",
  bloodGroup: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  medication: "",
  chronicDiseases: "",
  allergies: "",
  surgeries: "",
  smoking: "No",
  alcohol: "No",
  activityLevel: "Moderate",
  sleepHours: "",
};

const HealthForm: React.FC = () => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [originalForm, setOriginalForm] = useState<FormState>(defaultForm);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHealthForm();
        // Keep only known fields, and never feed null/undefined into a
        // controlled input (React would switch it to uncontrolled).
        const loaded = { ...defaultForm };
        (Object.keys(defaultForm) as (keyof FormState)[]).forEach((key) => {
          const value = data?.[key];
          if (value !== null && value !== undefined) loaded[key] = String(value);
        });
        setForm(loaded);
        setOriginalForm(loaded);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load your health form");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCancel = () => {
    setForm(originalForm);
    setEditMode(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);

    // Numbers must go over as numbers; blanks are omitted rather than sent as
    // empty strings, which Mongoose would reject when casting to Number.
    const payload: HealthFormData = {
      ...(form as unknown as HealthFormData),
      age: form.age === "" ? undefined : Number(form.age),
      sleepHours: form.sleepHours === "" ? undefined : Number(form.sleepHours),
      smoking: form.smoking as "Yes" | "No",
      alcohol: form.alcohol as "Yes" | "No",
      activityLevel: form.activityLevel as "Low" | "Moderate" | "High",
    };

    try {
      await updateHealthForm(payload);
      setNotice("Health form updated.");
      setOriginalForm(form);
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update health form");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Health Form</h2>

      {error && (
        <p className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      {notice && (
        <p className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="age" type="number" min={0} max={120} value={form.age} disabled={!editMode} onChange={handleChange} className="border px-4 py-2 rounded" placeholder="Age" />
          <input name="bloodGroup" value={form.bloodGroup} disabled={!editMode} onChange={handleChange} className="border px-4 py-2 rounded" placeholder="Blood Group" />
          <input name="emergencyContactName" value={form.emergencyContactName} disabled={!editMode} onChange={handleChange} className="border px-4 py-2 rounded" placeholder="Emergency Contact Name" />
          <input name="emergencyContactPhone" value={form.emergencyContactPhone} disabled={!editMode} onChange={handleChange} className="border px-4 py-2 rounded" placeholder="Emergency Contact Phone" />
        </div>

        <textarea name="medication" value={form.medication} disabled={!editMode} onChange={handleChange} className="w-full border px-4 py-2 rounded" placeholder="Current Medications" />
        <textarea name="chronicDiseases" value={form.chronicDiseases} disabled={!editMode} onChange={handleChange} className="w-full border px-4 py-2 rounded" placeholder="Chronic Diseases" />
        <textarea name="allergies" value={form.allergies} disabled={!editMode} onChange={handleChange} className="w-full border px-4 py-2 rounded" placeholder="Allergies" />
        <textarea name="surgeries" value={form.surgeries} disabled={!editMode} onChange={handleChange} className="w-full border px-4 py-2 rounded" placeholder="Surgeries" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Smoking</label>
            <select name="smoking" value={form.smoking} disabled={!editMode} onChange={handleChange} className="w-full border px-4 py-2 rounded">
              <option value="No">No</option><option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Alcohol</label>
            <select name="alcohol" value={form.alcohol} disabled={!editMode} onChange={handleChange} className="w-full border px-4 py-2 rounded">
              <option value="No">No</option><option value="Yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Activity Level</label>
            <select name="activityLevel" value={form.activityLevel} disabled={!editMode} onChange={handleChange} className="w-full border px-4 py-2 rounded">
              <option value="Low">Low</option><option value="Moderate">Moderate</option><option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Sleep Hours</label>
            <input type="number" name="sleepHours" min={0} max={24} step={0.5} value={form.sleepHours} disabled={!editMode} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          {editMode ? (
            <>
              <Button type="button" variant="secondary" onClick={handleCancel} disabled={saving}>Cancel</Button>
              <Button type="submit" loading={saving}>Save</Button>
            </>
          ) : (
            <Button type="button" onClick={() => setEditMode(true)}>Edit</Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HealthForm;
