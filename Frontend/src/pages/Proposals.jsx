import React, { useState } from "react";
import { MdOutlineInbox } from "react-icons/md";
import { useOrganizerDashboard } from "../context/OrganizerDashboardContext";
import ProposalCard from "../components/OrganizerDashboard/ProposalCard";


const STATUS_FILTERS = [
  "all",
  "pending",
  "negotiating",
  "approved",
  "rejected",
];

const Proposals = () => {
  const { proposals, loading } = useOrganizerDashboard();
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? proposals : proposals.filter((p) => p.status === filter);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-base-content">
          Proposals
        </h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          {proposals.length} total ·{" "}
          {proposals.filter((p) => p.status === "pending").length} pending
        </p>
      </div>

      {/* Status filter */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        <div className="flex items-center gap-1 bg-base-200 border border-base-300/40 rounded-xl p-1 w-fit min-w-max">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filter === f
                  ? "bg-base-100 text-base-content shadow-sm"
                  : "text-base-content/40 hover:text-base-content/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((p) => (
            <ProposalCard key={p._id} proposal={p}  />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <MdOutlineInbox size={32} className="text-base-content/20 mb-3" />
          <p className="text-sm text-base-content/40">
            {filter === "all" ? "No proposals yet." : `No ${filter} proposals.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Proposals;
