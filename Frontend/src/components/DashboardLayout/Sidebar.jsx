import React from "react";
import { LogoIcon } from "../LogoIcon";
import { Link, NavLink } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineEvent,
  MdOutlineLogout,
  MdOutlineClose,
} from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";

const Sidebar = ({ handleLogout, isOpen, onClose }) => {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#1C2541] flex flex-col justify-between border-r border-[#3A506B]/30 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div>
        {/* Header */}
        <div className="p-4 border-b border-base-300 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={onClose}>
            <span className="w-8 h-8 flex items-center justify-center rounded-[9px] shrink-0 bg-primary">
              <LogoIcon />
            </span>
            <h1 className="font-bold text-md leading-none text-primary">
              <span className="text-base-content">Sponsor</span>Sync
            </h1>
          </Link>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden text-base-content/40 hover:text-base-content transition-colors"
          >
            <MdOutlineClose size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2">
          {[
            { to: "/dashboard", icon: <MdOutlineDashboard />, label: "Dashboard", end: true },
            { to: "/dashboard/events", icon: <MdOutlineEvent />, label: "My Events" },
            { to: "/dashboard/proposals", icon: <IoDocumentTextOutline />, label: "Proposals" },
          ].map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive ? "bg-secondary/60" : "hover:bg-base-100/40"
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-[#3A506B]/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <MdOutlineLogout />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;