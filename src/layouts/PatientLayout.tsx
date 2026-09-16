import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell, { type NavItem } from "./DashboardShell";

const navItems: NavItem[] = [
  { label: "Home", icon: "🏠", path: "/landing/patientHome" },
  { label: "Find Doctors", icon: "🩺", path: "/landing/patient/doctors" },
  { label: "Health Form", icon: "📋", path: "/landing/patient/health-form" },
  { label: "My Profile", icon: "👤", path: "/landing/patient/profile" },
];

const PatientLayout: React.FC = () => {
  const navigate = useNavigate();
  return (
    <DashboardShell
      brand="CureSync"
      accent="blue"
      navItems={navItems}
      onLogout={() => {
        localStorage.removeItem("token");
        navigate("/patient/login", { replace: true });
      }}
    />
  );
};

export default PatientLayout;
