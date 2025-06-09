import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import PatientLayout from "./layouts/PatientLayot";

// Landing Page
import HomePage from "./pages/HomePage";

// Doctor Auth & Dashboard
import DoctorLogin from "./pages/Auth/doctor/doctorLogin";
import DoctorRegister from "./pages/Auth/doctor/doctorRegister";
import DoctorHome from "./pages/Doctor/DoctorHome";

// Patient Auth & Dashboard
import PatientLogin from "./pages/Auth/patient/patienLogin"; // use 'patienLogin' if that's the actual file name
import PatientRegister from "./pages/Auth/patient/patientRegister";
import PatientHome from "./pages/Patient/PatientHome";
import HealthForm from "./pages/Patient/HealthForm";
import PatientProfile from "./pages/Patient/PatientProfile";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<HomePage />} />

        {/* Doctor Routes */}
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/landing/DoctorHome" element={<DoctorHome />} />

        {/* Patient Auth Routes (no layout) */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />

        {/* Patient Routes With Layout */}
        <Route path="/landing" element={<PatientLayout />}>
          <Route path="patientHome" element={<PatientHome />} />
          <Route path="patient/health-form" element={<HealthForm />} />
          <Route path="patient/profile" element={<PatientProfile/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
