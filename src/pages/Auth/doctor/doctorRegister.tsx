import React, { useState } from "react";
import { doctorRegister } from "../../../services/authService"; // adjust path if needed

import { Link } from "react-router-dom";

const DoctorRegister: React.FC = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    specialization: "",
    category: "",
    experience: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doctorRegister(form);
      alert("Doctor registered successfully!");
      setForm({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        password: "",
        specialization: "",
        category: "",
        experience: ""
      });
    } catch (error: any) {
      alert(error.message || "Registration failed");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Doctor Registration</h2>

        <div className="space-y-4">
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <select name="gender" value={form.gender} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2 border rounded" />
          <input name="specialization" placeholder="Field (e.g. Dermatology)" value={form.specialization} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input name="category" placeholder="Category (e.g. Surgeon)" value={form.category} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input
            name="experience"
            type="number"
            placeholder="Years of Experience"
            value={form.experience}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
        </div>

        <button type="submit" className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/doctor/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default DoctorRegister;
