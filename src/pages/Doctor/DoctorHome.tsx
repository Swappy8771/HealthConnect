import React from "react";
import { Link } from "react-router-dom";

const DoctorHome: React.FC = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800">Welcome</h1>
      <p className="mt-2 text-gray-600">
        Your account is approved. Publish the hours you accept appointments, and
        patients can start booking them.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to="/doctor/availability"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Set availability
        </Link>
        <Link to="/doctor/appointments"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          View appointments
        </Link>
      </div>
    </div>
  );
};

export default DoctorHome;
