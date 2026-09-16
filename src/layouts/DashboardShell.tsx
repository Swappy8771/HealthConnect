import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "../lib/cn";

export type NavItem = { label: string; icon: string; path: string };

type Props = {
  brand: string;
  /** Tailwind accent colour name, e.g. "blue" or "indigo". */
  accent: "blue" | "indigo";
  navItems: NavItem[];
  onLogout: () => void;
};

const ACCENT = {
  blue: { text: "text-blue-600", activeBg: "bg-blue-50", activeText: "text-blue-600" },
  indigo: { text: "text-indigo-600", activeBg: "bg-indigo-50", activeText: "text-indigo-600" },
};

/**
 * The shell all three dashboards share.
 *
 * Replaces three copies that differed only in brand, colour and nav items —
 * and none of which worked below 768px, because the w-64 sidebar was fixed
 * with no drawer. Here it collapses behind a menu button on small screens.
 */
const DashboardShell: React.FC<Props> = ({ brand, accent, navItems, onLogout }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const colours = ACCENT[accent];

  // Close the drawer after navigating.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const sidebar = (
    <>
      <div className={cn("px-6 py-6 font-bold text-2xl", colours.text)}>{brand}</div>
      <nav className="flex-1 px-2 pt-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition",
              location.pathname === item.path
                ? cn(colours.activeBg, colours.activeText)
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg shadow-sm text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </>
  );

  const currentLabel =
    navItems.find((item) => item.path === location.pathname)?.label || brand;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: static from md up, a drawer below it */}
      <aside className="hidden md:flex w-64 bg-white shadow-sm flex-col border-r border-gray-200">
        {sidebar}
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex items-center gap-3 border-b border-gray-200">
          <button
            className="md:hidden text-gray-600"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="text-lg font-semibold text-gray-800">{currentLabel}</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
