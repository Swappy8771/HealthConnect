import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const PatientLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any localStorage/session if needed
    localStorage.removeItem("patientToken");
    navigate("/patient/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-center border-b">
          <h2 className="text-xl font-bold text-blue-600">Patient Panel</h2>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link
            to="/landing/patientHome"
            className="text-gray-700 hover:text-blue-600"
          >
            🏠 Dashboard
          </Link>
      <Link
  to="/landing/patient/health-form"
  className="text-gray-700 hover:text-blue-600"
>
  🩺 Health Form
</Link>
          {/* Add more links as needed */}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Welcome, Patient</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="p-6 overflow-y-auto h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
