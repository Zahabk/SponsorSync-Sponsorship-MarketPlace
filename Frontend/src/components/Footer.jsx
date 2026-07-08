import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LogoIcon = () => (
  <svg
    viewBox="0 0 20 20"
    style={{ width: 12, height: 12 }}
    fill="none"
    stroke="#fff"
    strokeWidth="1.8"
  >
    <path d="M10 2L3 6v8l7 4 7-4V6L10 2z" />
  </svg>
);

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="w-full border-t border-base-300 bg-base-100 py-4">
      <div className=" px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2">
          <span
            className={`flex items-center justify-center rounded-[9px] shrink-0 w-6 h-6 ${user?.role === "organizer" ? "bg-primary" : "bg-secondary/80" || "bg-primary"}`}
          >
            <LogoIcon />
          </span>
          <span className="text-base-content font-mono text-sm font-medium">
            Sponsor
            <span
              className={`${user?.role === "organizer" ? "text-primary" : "text-secondary/80" || "text-primary"}`}
            >
              Sync
            </span>
          </span>
        </Link>

        {/* ── Copyright ── */}
        <p className="text-base-content/30 text-xs text-center sm:text-right">
          © {new Date().getFullYear()} SponsorSync · MERN Stack · Emails by
          Brevo
        </p>
      </div>
    </footer>
  );
};

export default Footer;
