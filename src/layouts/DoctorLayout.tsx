import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell, { type NavItem } from "./DashboardShell";

// Only routes registered in App.tsx; the rest are not built yet.
const navItems: NavItem[] = [
  { label: "Dashboard", icon: "📊", path: "/doctor/dashboard" },
  { label: "Appointments", icon: "📅", path: "/doctor/appointments" },
  { label: "Availability", icon: "🕒", path: "/doctor/availability" },
];

const DoctorLayout: React.FC = () => {
  const navigate = useNavigate();
  return (
    <DashboardShell
      brand="DoctorPanel"
      accent="blue"
      navItems={navItems}
      onLogout={() => {
        localStorage.removeItem("doctorToken");
        navigate("/doctor/login", { replace: true });
      }}
    />
  );
};

export default DoctorLayout;
