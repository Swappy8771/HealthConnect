import React, { useEffect, useState } from "react";
import { getHealthForm, updateHealthForm } from "../../services/patientService";

// Only fields that GET /api/patient/healthform returns and PUT accepts.
// fullName, gender and phone are account fields — they live on the profile
// page. They used to appear here and only saved because of a mass-assignment
// bug in the controller; they never loaded back.
const defaultForm = {
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
  const [form, setForm] = useState(defaultForm);
  const [originalForm, setOriginalForm] = useState(defaultForm);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHealthForm();
        // Keep only known fields, and never feed null/undefined into a
        // controlled input (React would switch it to uncontrolled).
        const loaded = { ...defaultForm };
        (Object.keys(defaultForm) as (keyof typeof defaultForm)[]).forEach((key) => {
          if (data?.[key] !== null && data?.[key] !== undefined) loaded[key] = data[key];
        });
        setForm(loaded);
        setOriginalForm(loaded);
      } catch (err) {
        console.error("Error fetching form:", err);
        alert(err instanceof Error ? err.message : "Could not load your health form");
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
    try {
      await updateHealthForm(form);
      alert("Health form updated successfully");
      setOriginalForm(form);
      setEditMode(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update health form");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Health Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="age" type="number" value={form.age} disabled={!editMode} onChange={handleChange} className="border px-4 py-2 rounded" placeholder="Age" />
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
            <input type="number" name="sleepHours" value={form.sleepHours} disabled={!editMode} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          {editMode ? (
            <>
              <button type="button" onClick={handleCancel} className="border px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save</button>
            </>
          ) : (
            <button type="button" onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default HealthForm;
