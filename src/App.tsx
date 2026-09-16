import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import ProtectedRoute from "./components/shared/ProtectedRoute";
import PatientLayout from "./layouts/PatientLayout";
import AdminLayout from "./layouts/AdminLayout";
import DoctorLayout from "./layouts/DoctorLayout";

// Landing Page
import HomePage from "./pages/HomePage";

// Doctor Auth & Dashboard
import DoctorLogin from "./pages/Auth/doctor/doctorLogin";
import DoctorRegister from "./pages/Auth/doctor/doctorRegister";
// import DoctorHome from "./pages/Doctor/DoctorHome";
// import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
// import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
// import DoctorPatients from "./pages/Doctor/DoctorPatients";
// import DoctorProfile from "./pages/Doctor/DoctorProfile";
// import DoctorSettings from "./pages/Doctor/DoctorSettings";

// Patient Auth & Dashboard
import PatientLogin from "./pages/Auth/patient/patienLogin";
import PatientRegister from "./pages/Auth/patient/patientRegister";
import PatientHome from "./pages/Patient/PatientHome";
import HealthForm from "./pages/Patient/HealthForm";
import PatientProfile from "./pages/Patient/PatientProfile";
import DoctorsList from "./pages/Auth/patient/DoctorList";

// Admin Auth & Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminDoctorApproval from "./pages/Doctor/AdminDoctorApproval";
import DoctorHome from "./pages/Doctor/DoctorHome";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<HomePage />} />

        {/* Doctor Auth */}
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />

        {/* Doctor Dashboard Routes */}
        <Route element={<ProtectedRoute tokenKey="doctorToken" loginPath="/doctor/login" />}>
        <Route path="/doctor" element={<DoctorLayout />}>
         <Route path="dashboard" element={<DoctorHome />} />
        
          {/* <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="settings" element={<DoctorSettings />} /> */}
        </Route>
        </Route>

        {/* Patient Auth */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />

        {/* Patient Dashboard Routes */}
        <Route element={<ProtectedRoute tokenKey="token" loginPath="/patient/login" />}>
        <Route path="/landing" element={<PatientLayout />}>
          <Route path="patientHome" element={<PatientHome />} />
          <Route path="patient/health-form" element={<HealthForm />} />
          <Route path="patient/profile" element={<PatientProfile />} />
          <Route path="patient/doctors" element={<DoctorsList />} />
        </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute tokenKey="adminToken" loginPath="/admin/login" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctor-requests" element={<AdminDoctorApproval />} />
          </Route>
        </Route>

        {/* Unknown URL: send people somewhere real instead of a blank page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
