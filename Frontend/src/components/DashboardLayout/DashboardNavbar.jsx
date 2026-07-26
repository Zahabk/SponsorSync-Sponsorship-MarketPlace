import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMenu, MdOutlineCreate } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const DashboardNavbar = ({ user, onMenuClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-[#1C2541] border-b border-[#3A506B]/30 flex items-center justify-between px-4 sm:px-8 shrink-0">
      {/* hamburger mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-base-content/60 hover:text-base-content transition-colors"
        aria-label="Open menu"
      >
        <MdOutlineMenu size={22} />
      </button>
      <div className="flex items-center gap-4 sm:gap-6 ml-auto">
        {/* Avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center focus:outline-none rounded-full"
          >
            <img
              src={user?.profileImage || "/avatar.jpg"}
              alt={user?.firstName || "avatar"}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-base-300 transition ${
                user?.role === "organizer"
                  ? "hover:border-primary/40"
                  : "hover:border-secondary/80"
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-base-200 border border-base-300 rounded-box shadow-lg py-2 z-50">
              {(user?.firstName || user?.email) && (
                <div className="px-4 py-2 border-b border-base-300 mb-1">
                  <p className="font-semibold text-sm truncate text-base-content">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-base-content/50 truncate">
                    {user?.email}
                  </p>
                  <p
                    className={`text-xs first-letter:uppercase mt-0.5 ${
                      user?.role === "organizer"
                        ? "text-primary"
                        : "text-secondary"
                    }`}
                  >
                    {user?.role}
                  </p>
                </div>
              )}
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-1 px-4 py-2 text-sm text-base-content/80 transition  hover:bg-primary/40"
              >
                <CgProfile size={15} />
                My Profile
              </Link>
              <Link
                to="/create-event"
                onClick={() => setDropdownOpen(false)}
                className=" flex items-center gap-1 px-4 py-2 text-sm text-base-content/80 hover:bg-primary/40 transition"
              >
                <MdOutlineCreate size={15} />
                Create Event
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
