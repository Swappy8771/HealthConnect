import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deletePatientProfile,
  getPatientProfile,
  updatePatientProfile,
} from "../../services/patientService";
import type { Gender, PatientProfile as Profile } from "../../services/types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

type EditableProfile = {
  fullName: string;
  email: string;
  phone: string;
  gender: Gender | "";
  dateOfBirth: string;
};

const EMPTY: EditableProfile = {
  fullName: "", email: "", phone: "", gender: "", dateOfBirth: "",
};

/** Mongo returns a full ISO string; <input type="date"> needs yyyy-mm-dd and
 *  silently renders empty otherwise — which then saved the blank back. */
const toDateInput = (value?: string) => (value ? value.slice(0, 10) : "");

const PatientProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<EditableProfile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = (data: Profile) =>
    setProfile({
      fullName: data.fullName ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      gender: (data.gender as Gender) ?? "",
      dateOfBirth: toDateInput(data.dateOfBirth),
    });

  useEffect(() => {
    const controller = new AbortController();
    getPatientProfile()
      .then(load)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load profile."))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async () => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      // Send only what may change. Email is the login identifier and the
      // server ignores it, so including it just invites confusion.
      const updated = await updatePatientProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        gender: profile.gender as Gender,
        dateOfBirth: profile.dateOfBirth || undefined,
      });
      load(updated);
      setNotice("Profile updated.");
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePatientProfile();
      localStorage.removeItem("token");
      navigate("/patient/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete your account");
      setConfirmDelete(false);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">Patient Profile</h2>

      {error && (
        <p className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}
      {notice && (
        <p className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">{notice}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-sm text-gray-600">Full name</span>
          <input name="fullName" value={profile.fullName} onChange={handleChange}
            disabled={!editMode} placeholder="Full Name"
            className="mt-1 border px-4 py-2 rounded w-full disabled:bg-gray-50" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Email (cannot be changed)</span>
          <input value={profile.email} disabled
            className="mt-1 border px-4 py-2 rounded w-full bg-gray-100" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Phone</span>
          <input name="phone" value={profile.phone} onChange={handleChange}
            disabled={!editMode} placeholder="Phone"
            className="mt-1 border px-4 py-2 rounded w-full disabled:bg-gray-50" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Gender</span>
          <select name="gender" value={profile.gender} onChange={handleChange}
            disabled={!editMode}
            className="mt-1 border px-4 py-2 rounded w-full disabled:bg-gray-50">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Date of birth</span>
          <input name="dateOfBirth" type="date" value={profile.dateOfBirth}
            onChange={handleChange} disabled={!editMode}
            className="mt-1 border px-4 py-2 rounded w-full disabled:bg-gray-50" />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {editMode ? (
          <>
            <Button variant="secondary" onClick={() => setEditMode(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} loading={saving}>Save</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" className="text-red-600 hover:bg-red-50"
              onClick={() => setConfirmDelete(true)}>
              Delete account
            </Button>
            <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
          </>
        )}
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete your account?"
        className="max-w-md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete permanently</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          This removes your profile and health record for good. It cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default PatientProfile;
