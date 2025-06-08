import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react"; // or use any icon lib you prefer
import React from "react";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth storage/session
    localStorage.removeItem("token"); // Adjust key as needed
    sessionStorage.clear();
    
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-red-500 hover:text-red-700 text-sm"
      title="Logout"
    >
      <LogOut className="w-4 h-4 mr-1" />
      Logout
    </button>
  );
};

export default LogoutButton;
