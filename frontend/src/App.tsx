import React, { Suspense, lazy } from "react";
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

// Admin Auth & Pages
import AdminLogin from "./pages/Admin/AdminLogin";


// Dashboard pages are loaded on demand — they are behind a login and were
// previously all in the initial bundle.
const PatientHome = lazy(() => import("./pages/Patient/PatientHome"));
const HealthForm = lazy(() => import("./pages/Patient/HealthForm"));
const PatientProfile = lazy(() => import("./pages/Patient/PatientProfile"));
const DoctorsList = lazy(() => import("./pages/Auth/patient/DoctorList"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminDoctorApproval = lazy(() => import("./pages/Doctor/AdminDoctorApproval"));
const DoctorHome = lazy(() => import("./pages/Doctor/DoctorHome"));
const DoctorAvailability = lazy(() => import("./pages/Doctor/DoctorAvailability"));
const DoctorAppointments = lazy(() => import("./pages/Doctor/DoctorAppointments"));
const BookAppointment = lazy(() => import("./pages/Patient/BookAppointment"));
const MyAppointments = lazy(() => import("./pages/Patient/MyAppointments"));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense
        fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}
      >
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
         <Route path="availability" element={<DoctorAvailability />} />
         <Route path="appointments" element={<DoctorAppointments />} />
        
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
          <Route path="patient/doctors/:doctorId/book" element={<BookAppointment />} />
          <Route path="patient/appointments" element={<MyAppointments />} />
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
      </Suspense>
    </Router>
  );
};

export default App;
