import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage" // adjust the path if needed
import DoctorLogin from "./pages/Auth/doctor/doctorLogin";
import DoctorRegister from "./pages/Auth/doctor/doctorRegister";
import PatientLogin from "./pages/Auth/patient/patienLogin";
import PatientRegister from "./pages/Auth/patient/patientRegister";
import PatientHome from "./pages/Landing/PatientHome";
import DoctorHome from "./pages/Landing/DoctorHome";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister/>} />
        <Route path="/landing/DoctorHome" element={<DoctorHome />} />

         <Route path="/patient/login" element={<PatientLogin />} />
         <Route path="/patient/register" element={<PatientRegister/>} />
           <Route path="/landing/patientHome" element={<PatientHome />} />

      </Routes>
    </Router>
  );
};

export default App;
