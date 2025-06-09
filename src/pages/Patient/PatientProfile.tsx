// src/pages/Patient/PatientProfile.tsx

import React, { useEffect, useState } from "react";
import {
  getPatientProfile,
  updatePatientProfile,
} from "../../services/patientService";

const PatientProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPatientProfile();
        setProfile(data);
        setLoading(false);
      } catch (err) {
        alert("Failed to load profile.");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updatePatientProfile(profile);
      alert("Profile updated successfully");
      setEditMode(false);
    } catch (err: any) {
      alert(err.message || "Update failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">Patient Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          name="fullName"
          value={profile.fullName}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Full Name"
          className="border px-4 py-2 rounded w-full"
        />
        <input
          name="email"
          value={profile.email}
          disabled
          placeholder="Email"
          className="border px-4 py-2 rounded w-full bg-gray-100"
        />
        <input
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Phone"
          className="border px-4 py-2 rounded w-full"
        />
        <select
          name="gender"
          value={profile.gender}
          onChange={handleChange}
          disabled={!editMode}
          className="border px-4 py-2 rounded w-full"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="dateOfBirth"
          type="date"
          value={profile.dateOfBirth}
          onChange={handleChange}
          disabled={!editMode}
          className="border px-4 py-2 rounded w-full"
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        {editMode ? (
          <>
            <button
              onClick={() => setEditMode(false)}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;
