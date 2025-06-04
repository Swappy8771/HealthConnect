// src/pages/Auth/patient/PatientLogin.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientLogin } from "../../../services/authService";

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await patientLogin({ email, password });
      console.log("Login Success:", result);
      localStorage.setItem("token", result.token); // optional
      alert("Login successful!");
      navigate("/landing/patientHome");
    } catch (error: any) {
      console.error("Login Error:", error.message);
      alert(error.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold text-center">Patient Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Login
      </button>
    </form>
  );
};

export default PatientLogin;
