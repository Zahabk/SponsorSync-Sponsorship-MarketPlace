import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogoIcon } from "./LogoIcon";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineCreate, MdLogout } from "react-icons/md";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="navbar sticky top-0 z-50 border-b border-base-300 px-4 sm:px-6 bg-base-100">
        <div className="navbar-start">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center rounded-[9px] shrink-0 bg-primary">
              <LogoIcon />
            </span>
            <span className="font-medium text-md font-mono text-amber-50">
              Sponsor<span className="text-primary">Sync</span>
            </span>
          </Link>
        </div>
        <div className="navbar-end">
          <div className="w-9 h-9 rounded-full bg-base-300 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="navbar sticky top-0 z-50 border-b border-base-300 px-4 sm:px-6 bg-base-100">
      {/* ── Logo ── */}
      <div className="navbar-start">
        <Link to="/" className="flex items-center gap-2">
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-[9px] shrink-0 ${user?.role === "organizer" ? "bg-primary" : "bg-secondary/80"}`}
          >
            <LogoIcon />
          </span>
          <span className="font-medium text-sm sm:text-md font-mono text-base-content whitespace-nowrap">
            Sponsor
            <span
              className={`${user?.role === "organizer" ? "text-primary" : "text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]"}`}
            >
              Sync
            </span>
          </span>
        </Link>
      </div>

      <div className="navbar-end gap-2">
        {/* Desktop/Tablet Navbar */}
        <div className="hidden sm:flex gap-2 items-center">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="btn btn-sm font-medium border border-base-300 text-base-content/60 hover:text-base-content hover:border-primary hover:bg-base-100"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm font-semibold text-base-content"
              >
                Get Started →
              </Link>
            </>
          ) : (
            <div className={`flex justify-center items-center gap-6  `}>
              <Link
                to="/events"
                className={`text-xs font-bold ${user?.role === "organizer" ? "hover:text-primary/80" : "hover:text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]"} text-base-content/80`}
              >
                Browse Events
              </Link>

              <div
                className="relative flex justify-center items-center"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none rounded-full"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.firstName}
                      className={`w-10 h-10 rounded-full object-cover border-3 border-base-300  transition ${user.role === "organizer" ? "hover:border-primary/40" : "hover:border-secondary/80"}`}
                    />
                  ) : (
                    <img
                      src="/avatar.jpg"
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border-3 border-base-300 hover:border-primary transition"
                    />
                  )}
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
                          className={`text-sm ${user?.role === "organizer" ? "text-primary" : "text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]"} first-letter:uppercase`}
                        >
                          {user.role}
                        </p>
                      </div>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center px-4 py-2 text-sm text-base-content/80 hover:bg-primary/40 hover:text-base-content transition ${user.role === "organizer" ? "hover:bg-primary/40" : "hover:bg-secondary/40"}`}
                    >
                      <FaRegUserCircle className="mr-1" />
                      My Profile
                    </Link>

                    <Link
                      to={
                        user?.role === "organizer"
                          ? "/dashboard"
                          : "/sponsor/dashboard"
                      }
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center px-4 py-2 text-sm text-base-content/80 hover:bg-primary/40 hover:text-base-content transition ${user.role === "organizer" ? "hover:bg-primary/40" : "hover:bg-secondary/40"}`}
                    >
                      <MdOutlineDashboard className="mr-1" />
                      Dashboard
                    </Link>
                    {user.role === "organizer" && (
                      <Link
                        to="/create-event"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-base-content/80 hover:bg-primary/40 hover:text-base-content transition"
                      >
                        <MdOutlineCreate className="mr-1" />
                        Create Event
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition mt-1 border-t border-base-300 pt-2"
                    >
                      <MdLogout className="mr-1" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navbar */}
        <div className="relative sm:hidden" ref={mobileRef}>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/events"
                className={`text-xs font-bold ${user?.role === "organizer" ? "hover:text-primary/80" : "hover:text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]"} text-base-content/80`}
              >
                Browse Events
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center focus:outline-none rounded-full shrink-0"
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user?.firstName}
                    className="w-9 h-9 rounded-full object-cover border border-base-300 hover:border-primary transition"
                  />
                ) : (
                  <img
                    src="/avatar.jpg"
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-base-300 hover:border-primary transition"
                  />
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-sm px-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
          )}

          {/* Dropdown — mobile*/}
          {mobileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 max-w-[90vw] bg-base-200 border border-base-300 rounded-box shadow-lg py-2 z-50">
              {!isAuthenticated ? (
                <div className="p-2 flex flex-col gap-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-sm w-full font-medium border border-base-300 text-base-content/60 hover:text-base-content hover:border-primary hover:bg-base-100"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary btn-sm w-full mt-1 font-semibold text-amber-50"
                  >
                    Get Started →
                  </Link>
                </div>
              ) : (
                <>
                  {(user?.firstName || user?.email) && (
                    <div className="px-4 py-2 border-b border-base-300 mb-1">
                      <p className="font-semibold text-sm truncate text-base-content">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-base-content/50 truncate">
                        {user?.email}
                      </p>
                      <p
                        className={`text-sm ${user?.role === "organizer" ? "text-primary" : "text-[color-mix(in_srgb,var(--color-secondary)_60%,#fff)]"} first-letter:uppercase`}
                      >
                        {user.role}
                      </p>
                    </div>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm text-base-content/80 hover:bg-primary/40 hover:text-base-content transition ${user.role === "organizer" ? "hover:bg-primary/40" : "hover:bg-secondary/40"}`}
                  >
                    <FaRegUserCircle className="mr-1" />
                    My Profile
                  </Link>
                  <Link
                    to={
                      user?.role === "organizer"
                        ? "/dashboard"
                        : "/sponsor/dashboard"
                    }
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm text-base-content/80 hover:bg-primary/40 hover:text-base-content transition ${user.role === "organizer" ? "hover:bg-primary/40" : "hover:bg-secondary/40"}`}
                  >
                    <MdOutlineDashboard className="mr-1" />
                    Dashboard
                  </Link>
                  {user?.role === "organizer" && (
                    <Link
                      to="/create-event"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-base-content/80 hover:bg-primary/40 hover:text-base-content transition"
                    >
                      <MdOutlineCreate className="mr-1" />
                      Create Event
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition mt-1 border-t border-base-300 pt-2"
                  >
                    <MdLogout className="mr-1" />
                    Log Out
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
