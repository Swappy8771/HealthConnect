import React from "react";

const DoctorHome: React.FC = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800">Welcome</h1>
      <p className="mt-2 text-gray-600">
        Your account is approved. Appointments and patient records are not built
        yet — this dashboard will fill in as those features land.
      </p>
    </div>
  );
};

export default DoctorHome;
