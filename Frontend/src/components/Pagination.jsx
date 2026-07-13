import React from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPages = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between sm:justify-center gap-2 my-4 max-w-md mx-auto px-2">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1.5 sm:py-1 bg-base-300 rounded-lg text-[13px] font-medium disabled:opacity-40 transition-opacity flex items-center gap-1 hover:bg-base-300/80"
      >
        <LuChevronLeft className="w-4 h-4 shrink-0" />
        <span className="sm:hidden">Prev</span>
      </button>

      {/* Number Pill Group — hides individual numbers on tiny devices*/}
      <div className="hidden sm:flex items-center gap-1.5">
        {getPages().map((page, i) =>
          page === "..." ? (
            <span key={`dot-${i}`} className="px-1 text-base-content/40 font-bold">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md text-[13px] transition-all ${
                currentPage === page
                  ? "bg-primary text-primary-content font-bold shadow-md shadow-primary/10"
                  : "bg-base-200 hover:bg-base-300/60"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Mobile Current Page Indicator */}
      <span className="sm:hidden text-[13px] font-medium text-base-content/60">
        Page <span className="font-bold text-base-content">{currentPage}</span> of {totalPages}
      </span>

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1.5 sm:py-1 bg-base-300 rounded-lg text-[13px] font-medium disabled:opacity-40 transition-opacity flex items-center gap-1 hover:bg-base-300/80"
      >
        <span className="sm:hidden">Next</span>
        <LuChevronRight className="w-4 h-4 shrink-0" />
      </button>
    </div>
  );
};

export default Pagination;
