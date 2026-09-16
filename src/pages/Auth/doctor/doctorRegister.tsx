import React, { useState } from "react";
import { doctorRegister } from "../../../services/authService";
import { Link } from "react-router-dom";

const DoctorRegister: React.FC = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    education: [""],
    specialization: "",
    experience: "",
    clinic: {
      name: "",
      address: "",
      consultationType: "Both",
      consultationFee: ""
    },
    documents: {
      degrees: [""],
      license: "",
      idProof: ""
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes("clinic.")) {
      const field = name.split(".")[1];
      setForm({ ...form, clinic: { ...form.clinic, [field]: value } });
    } else if (name.includes("documents.")) {
      const field = name.split(".")[1];
      setForm({ ...form, documents: { ...form.documents, [field]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEducationChange = (index: number, value: string) => {
    const updated = [...form.education];
    updated[index] = value;
    setForm({ ...form, education: updated });
  };

  const addEducationField = () => {
    setForm({ ...form, education: [...form.education, ""] });
  };

  const handleDegreeChange = (index: number, value: string) => {
    const updated = [...form.documents.degrees];
    updated[index] = value;
    setForm({ ...form, documents: { ...form.documents, degrees: updated } });
  };

  const addDegreeField = () => {
    setForm({
      ...form,
      documents: { ...form.documents, degrees: [...form.documents.degrees, ""] }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctorRegister({
        ...form,
        experience: Number(form.experience),
        clinic: {
          ...form.clinic,
          consultationFee: Number(form.clinic.consultationFee)
        }
      });
      alert("Doctor registered successfully!");
      window.location.href = "/doctor/login";
    } catch (error: any) {
      alert(error.message || "Registration failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-lg space-y-4">
        <h2 className="text-2xl font-bold text-center text-blue-600">Doctor Registration</h2>

        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />

        <select name="gender" value={form.gender} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        <input name="experience" type="number" placeholder="Years of Experience" value={form.experience} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />

        {/* Education List */}
        <div className="space-y-2">
          <label className="block font-medium text-sm">Education</label>
          {form.education.map((ed, idx) => (
            <input key={idx} value={ed} onChange={(e) => handleEducationChange(idx, e.target.value)} placeholder={`Degree ${idx + 1}`} className="w-full px-4 py-2 border rounded" />
          ))}
          <button type="button" onClick={addEducationField} className="text-sm text-blue-600 underline">+ Add More</button>
        </div>

        {/* Clinic Info */}
        <hr />
        <h4 className="font-semibold text-gray-700">Clinic Info</h4>
        <input name="clinic.name" placeholder="Clinic Name" value={form.clinic.name} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="clinic.address" placeholder="Clinic Address" value={form.clinic.address} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <select name="clinic.consultationType" value={form.clinic.consultationType} onChange={handleChange} className="w-full px-4 py-2 border rounded">
          <option>Online</option>
          <option>Offline</option>
          <option>Both</option>
        </select>
        <input name="clinic.consultationFee" type="number" placeholder="Consultation Fee" value={form.clinic.consultationFee} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

        {/* Documents */}
        <hr />
        <h4 className="font-semibold text-gray-700">Documents</h4>
        <div className="space-y-2">
          {form.documents.degrees.map((deg, idx) => (
            <input key={idx} value={deg} onChange={(e) => handleDegreeChange(idx, e.target.value)} placeholder={`Degree Document URL ${idx + 1}`} className="w-full px-4 py-2 border rounded" />
          ))}
          <button type="button" onClick={addDegreeField} className="text-sm text-blue-600 underline">+ Add Degree</button>
        </div>
        <input name="documents.license" placeholder="License Document URL" value={form.documents.license} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
        <input name="documents.idProof" placeholder="ID Proof URL" value={form.documents.idProof} onChange={handleChange} className="w-full px-4 py-2 border rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Register</button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/doctor/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default DoctorRegister;
