import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patientLogin } from "../../../services/authService";

const PatientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await patientLogin({ email, password });
      localStorage.setItem("token", result.token);
      // The server already returns the patient summary; keeping it saves an
      // extra /me request just to greet them by name.
      localStorage.setItem("patient", JSON.stringify(result.patient));
      navigate("/landing/patientHome", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Left Hero Section */}
      <div className="md:w-1/2 hidden md:flex flex-col justify-center items-center bg-blue-100 px-12 py-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-6">Welcome Back 👋</h1>
        <p className="text-gray-700 text-lg">
          Login to access your personalized patient dashboard and manage your health efficiently.
        </p>
        </div>

      {/* Login Form */}
      <div className="md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Patient Login
          </h2>

          {error && (
            <p className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-right text-sm">
              <a href="#" className="text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition shadow-md"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/patient/register"
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;
