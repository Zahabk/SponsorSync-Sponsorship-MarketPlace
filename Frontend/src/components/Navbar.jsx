import React from "react";
import { Link, useLocation } from "react-router-dom";

const LogoIcon = () => (
  <svg
    viewBox="0 0 20 20"
    style={{ width: 16, height: 16 }}
    fill="none"
    stroke="#fff"
    strokeWidth="1.8"
  >
    <path d="M10 2L3 6v8l7 4 7-4V6L10 2zm0 2.5L15.2 8 10 11.5 4.8 8 10 4.5zM4 9.5l5.2 3v5.2L4 14.7V9.5zm7.2 8.2V12.5l5.2-3v5.2l-5.2 3z" />
  </svg>
);

const Navbar = () => {
  return (
    <div className="navbar sticky top-0 z-50 border-b border-base-300 px-6 bg-base-100">
      {/* ── Logo ── */}
      <div className="navbar-start">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 flex items-center justify-center rounded-[9px] shrink-0 bg-primary">
            <LogoIcon />
          </span>
          <span className="font-medium text-md font-mono text-amber-50"
            // style={{
            //   fontFamily: "'DM Mono', monospace",
            //   fontWeight: 500,
            //   fontSize: 16,
            //   color: "#E8EDF5",
            //   letterSpacing: ".4px",
            // }}
          >
            Sponsor<span className="text-primary">Sync</span>
          </span>
        </Link>
      </div>

      <div className="navbar-end gap-2">
        {/* Desktop/Tablet  */}
        <div className="hidden sm:flex gap-2 items-center">
          <Link
            to="/login"
            className="btn btn-sm font-medium border border-base-300 text-base-content/60 hover:text-base-content hover:border-primary hover:bg-base-100"
          >
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm font-semibold text-amber-50">
            Get Started →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="dropdown dropdown-end sm:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
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
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-200 rounded-box border border-base-300 z-50 mt-3 w-44 p-2 shadow-lg"
          >
            <li>
              <Link
                to="/login"
                className="btn btn-sm font-medium border border-base-300 text-base-content/60 hover:text-base-content hover:border-primary hover:bg-base-100"
              >
                Log in
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="btn btn-primary btn-sm mt-1 font-semibold text-amber-50"
              >
                Get Started →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
