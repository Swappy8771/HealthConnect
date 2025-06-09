import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Overview", icon: "📊", path: "/landing/patientHome" },
  { label: "Appointments", icon: "📅", path: "/landing/patient/appointments" },
  { label: "Doctors", icon: "🩺", path: "/landing/patient/doctors" },
  { label: "Health Form", icon: "📄", path: "/landing/patient/health-form" },
  { label: "Profile", icon: "👤", path: "/landing/patient/profile" },
  { label: "Settings", icon: "⚙️", path: "/landing/patient/settings" },
];

const PatientLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    navigate("/patient/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col rounded-tr-3xl rounded-br-3xl">
        <div className="px-6 py-6 text-blue-600 font-bold text-2xl">
          HealthConnect
        </div>
        <nav className="flex-1 px-4 pt-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded shadow-md text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-lg px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Appointments View
          </h1>
          <div>
            <input
              type="text"
              placeholder="Search for anything..."
              className="px-4 py-2 w-64 rounded-full shadow-md text-sm focus:outline-blue-400"
            />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
