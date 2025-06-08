import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import LogoutButton from "./Logout";

type NavLink = {
  label: string;
  path: string;
};

interface HeaderProps {
  title: string;
  navLinks: NavLink[];
  userName?: string;
  showLogout?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  navLinks,
  userName = "Guest",
  showLogout = true,
  onLogout,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md px-4 py-3 md:px-8 flex justify-between items-center">
      {/* Logo / Title */}
      <div className="text-xl font-bold text-blue-600 flex items-center gap-2">
        
        <span>{title}</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="hidden md:flex items-center gap-4">
        <span className="text-sm text-gray-600">👤 {userName}</span>
        {showLogout && (
          <button
            onClick={onLogout}
            className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition"
          >
            Logout
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-md p-4 flex flex-col gap-3 z-50 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm text-gray-600">👤 {userName}</span>
            <LogoutButton/>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
