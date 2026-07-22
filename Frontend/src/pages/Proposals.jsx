import React, { useState } from "react";
import { MdOutlineInbox } from "react-icons/md";
import { useOrganizerDashboard } from "../context/OrganizerDashboardContext";

const STATUS_STYLE = {
  pending:     "bg-warning/15 text-warning border-warning/30",
  negotiating: "bg-secondary/15 text-secondary border-secondary/30",
  approved:    "bg-success/15 text-success border-success/30",
  rejected:    "bg-error/15 text-error border-error/30",
};

const TIER_STYLE = {
  Gold:   "text-amber-400",
  Silver: "text-slate-300",
  Bronze: "text-orange-500",
};

const STATUS_FILTERS = ["all", "pending", "negotiating", "approved", "rejected"];

const ProposalCard = ({ proposal }) => {
  const [showCounter, setShowCounter] = useState(false);
  const [counterOffer, setCounterOffer] = useState("");
  const [counterNote, setCounterNote] = useState("");

  const isNegotiating = proposal.status === "negotiating";
  const isSettled = ["approved", "rejected"].includes(proposal.status);

  const handleApprove = () => {
    // TODO: PATCH /api/proposals/:id { status: "approved" }
  };
  const handleReject = () => {
    // TODO: PATCH /api/proposals/:id { status: "rejected" }
  };
  const handleCounter = () => {
    // TODO: PATCH /api/proposals/:id { status: "negotiating", counterOffer, counterNote }
    setShowCounter(false);
  };

  return (
    <div className={`bg-base-200 rounded-2xl border overflow-hidden transition-all ${
      isNegotiating              ? "border-secondary/30" :
      proposal.status === "approved" ? "border-success/20"   :
      proposal.status === "rejected" ? "border-error/20"     :
      "border-base-300/30"
    }`}>
      {/* Main row */}
      <div className="flex items-start justify-between gap-3 p-3 sm:p-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-bold text-base-content truncate">
              {proposal.event?.title ?? "—"}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize shrink-0 ${STATUS_STYLE[proposal.status]}`}>
              {proposal.status}
            </span>
          </div>
          <p className="text-xs text-base-content/50">
            {proposal.sponsor?.name ?? "Sponsor"}&nbsp;·&nbsp;
            <span className={`font-semibold ${TIER_STYLE[proposal.tier]}`}>
              ★ {proposal.tier}
            </span>
          </p>
        </div>

        <div className="text-right shrink-0">
          {isNegotiating && proposal.counterOffer ? (
            <>
              <p className="text-xs text-base-content/40 line-through">
                ${proposal.proposedBudget.toLocaleString("en-US")}
              </p>
              <p className="text-sm sm:text-base font-bold text-secondary">
                ${proposal.counterOffer.toLocaleString("en-US")}
              </p>
              <p className="text-[10px] text-base-content/40">counter offer</p>
            </>
          ) : (
            <>
              <p className={`text-sm sm:text-base font-bold ${proposal.status === "approved" ? "text-success" : "text-base-content"}`}>
                ${proposal.proposedBudget.toLocaleString("en-US")}
              </p>
              <p className="text-[10px] text-base-content/40">
                {proposal.status === "approved" ? "confirmed" : "proposed"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Message */}
      {proposal.message && (
        <div className="px-3 sm:px-4 py-2.5 border-t border-base-300/30 bg-base-300/10 text-xs text-base-content/50 italic">
          "{proposal.message}"
        </div>
      )}

      {/* Counter note */}
      {isNegotiating && proposal.counterNote && (
        <div className="px-3 sm:px-4 py-2.5 border-t border-base-300/30 bg-secondary/5 text-xs text-base-content/50">
          Counter note:{" "}
          <span className="text-base-content/80 not-italic">{proposal.counterNote}</span>
        </div>
      )}

      {/* Counter form */}
      {showCounter && (
        <div className="px-3 sm:px-4 py-3 border-t border-base-300/30 bg-base-300/10 space-y-2">
          <input
            type="number"
            placeholder="Counter amount ($)"
            value={counterOffer}
            onChange={(e) => setCounterOffer(e.target.value)}
            className="w-full bg-base-100 border border-base-300/40 rounded-lg px-3 py-2 text-xs text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-secondary/50 transition-colors"
          />
          <textarea
            placeholder="Add a note (optional)"
            value={counterNote}
            onChange={(e) => setCounterNote(e.target.value)}
            rows={2}
            className="w-full bg-base-100 border border-base-300/40 rounded-lg px-3 py-2 text-xs text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-secondary/50 transition-colors resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCounter}
              className="flex-1 py-2 rounded-lg text-xs font-medium bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 transition-colors"
            >
              Send counter
            </button>
            <button
              onClick={() => setShowCounter(false)}
              className="flex-1 py-2 rounded-lg text-xs font-medium border border-base-300/30 text-base-content/40 hover:text-base-content/70 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isSettled && !showCounter && (
        <div className="flex gap-2 px-3 sm:px-4 py-3 border-t border-base-300/30">
          <button
            onClick={handleApprove}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-success/10 text-success border border-success/25 hover:bg-success/20 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="flex-1 py-2 rounded-lg text-xs font-medium bg-error/10 text-error border border-error/25 hover:bg-error/20 transition-colors"
          >
            Reject
          </button>
          {!isNegotiating && (
            <button
              onClick={() => setShowCounter(true)}
              className="flex-1 py-2 rounded-lg text-xs font-medium border border-base-300/30 text-base-content/50 hover:text-base-content/80 transition-colors"
            >
              Counter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const Proposals = () => {
  const { proposals, loading } = useOrganizerDashboard();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? proposals
    : proposals.filter((p) => p.status === filter);

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
        <h1 className="text-xl sm:text-2xl font-bold text-base-content">Proposals</h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          {proposals.length} total · {proposals.filter((p) => p.status === "pending").length} pending
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

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((p) => (
            <ProposalCard key={p._id} proposal={p} />
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