import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTypeModal from "../UserType";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"login" | "signup" | null>(null);
  const navigate = useNavigate();

  const handleAuthClick = (type: "login" | "signup") => {
    setActionType(type);
    setIsModalOpen(true);
  };

  const handleRoleSelect = (role: "doctor" | "patient") => {
    setIsModalOpen(false);
    if (actionType) {
      navigate(`/${role}/${actionType === "signup" ? "register" : "login"}`);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
          <span className="flex items-center gap-2">
            <span className="text-3xl">⚕️</span> HealthConnect
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <a href="#home" className="hover:text-blue-600 transition">Home</a>
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">How it Works</a>
          <a href="#doctors" className="hover:text-blue-600 transition">Find Doctors</a>
          <a href="#faq" className="hover:text-blue-600 transition">FAQs</a>
          <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
        </nav>

        {/* CTA Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleAuthClick("login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
          <button
            onClick={() => handleAuthClick("signup")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Modal for User Type Selection */}
      <UserTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleRoleSelect}
      />
    </header>
  );
};

export default Navbar;
