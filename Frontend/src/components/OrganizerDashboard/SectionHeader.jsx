import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowForward } from "react-icons/md";

const SectionHeader = ({ title, to, linkLabel = "View all" }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-base-content">{title}</h2>
      {to && (
        <Link
          to={to}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/70 transition-colors"
        >
          {linkLabel}
          <MdOutlineArrowForward size={14} />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
