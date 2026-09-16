import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, Admin</h2>
      <p className="text-gray-600 mb-6">
        This is your admin dashboard. From here, you can manage doctors, patients, appointments, and system settings.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-indigo-700">👥 Total Patients</h3>
          <p className="text-3xl font-bold text-indigo-900 mt-2">120</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-blue-700">🩺 Total Doctors</h3>
          <p className="text-3xl font-bold text-blue-900 mt-2">34</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-green-700">📅 Appointments Today</h3>
          <p className="text-3xl font-bold text-green-900 mt-2">15</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
