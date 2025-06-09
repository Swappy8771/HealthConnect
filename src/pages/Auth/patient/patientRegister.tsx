import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { patientRegister } from "../../../services/authService";

interface PatientForm {
  fullName: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
}

const PatientRegister: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<PatientForm>({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await patientRegister(form);
      alert("Registration successful!");
      navigate("/patient/login");
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Left Side Image / Branding */}
      <div className="md:w-1/2 hidden md:flex flex-col justify-center items-center bg-blue-100 px-10 py-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Join CureSync 🏥
        </h1>
        <p className="text-gray-700 text-lg text-center max-w-md">
          Easily register and start booking appointments, uploading health forms,
          and managing your patient profile from one central place.
        </p>
        <img
          src="https://cdn.dribbble.com/users/1583540/screenshots/20409248/media/1234567890abcdef1234567890abcdef.jpg"
          alt="Illustration"
          className="mt-10 max-w-sm rounded-xl shadow-lg"
        />
      </div>

      {/* Right Side Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md  shadow-2xl rounded-xl px-8 py-10"
        >
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Create Your Account
          </h2>

          <div className="space-y-4">
            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition shadow-lg"
          >
            Register
          </button>

          <p className="text-sm text-center mt-4 text-gray-600">
            Already have an account?{" "}
            <Link to="/patient/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default PatientRegister;
