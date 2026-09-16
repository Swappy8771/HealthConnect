import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell, { type NavItem } from "./DashboardShell";

// Only routes registered in App.tsx. Links to unbuilt pages rendered the shell
// with an empty content area and no explanation.
const navItems: NavItem[] = [
  { label: "Dashboard", icon: "🧭", path: "/admin/dashboard" },
  { label: "Manage Doctors", icon: "🩺", path: "/admin/doctor-requests" },
];

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  return (
    <DashboardShell
      brand="AdminPanel"
      accent="indigo"
      navItems={navItems}
      onLogout={() => {
        localStorage.removeItem("adminToken");
        navigate("/admin/login", { replace: true });
      }}
    />
  );
};

export default AdminLayout;
