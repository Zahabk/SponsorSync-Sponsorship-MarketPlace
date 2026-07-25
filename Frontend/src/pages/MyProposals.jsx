import React, { useEffect, useState } from "react";
import { MdInbox, MdOutlineCalendarToday } from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import StatusBadge from "../components/OrganizerDashboard/StatusBadge";
import ProposalService from "../services/proposal";
import { toast } from "react-toastify";

const tierConfig = {
  Gold: "text-amber-400 font-semibold",
  Silver: "text-slate-300 font-semibold",
  Bronze: "text-orange-500 font-semibold",
};

const tierBg = {
  Gold: "bg-amber-400/10",
  Silver: "bg-slate-300/10",
  Bronze: "bg-orange-500/10",
};

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await ProposalService.getMyProposal();
        setProposals(res.data || []);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setProposals([]);
        } else {
          toast.error("Failed to load proposals. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const filters = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "negotiating", label: "Negotiating" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  const filtered = activeFilter === "all"
    ? proposals
    : proposals.filter((p) => p.status === activeFilter);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-secondary" />
      </div>
    );
  }

  return (
  <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
    {/* Header */}
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-base-content">
        My Proposals
      </h1>
      <p className="text-sm text-base-content/50 mt-0.5">
        Track the status of your sponsorship proposals.
      </p>
    </div>

    {/* Filter bar */}
    {proposals.length > 0 && (
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map(({ key, label }) => {
          const count =
            key === "all"
              ? proposals.length
              : proposals.filter((p) => p.status === key).length;
          const isActive = activeFilter === key;
          const accentClass =
            key === "approved"
              ? "border-success text-success bg-success/10"
              : key === "rejected"
                ? "border-error text-error bg-error/10"
                : key === "negotiating"
                  ? "border-secondary text-secondary bg-secondary/10"
                  : key === "pending"
                    ? "border-warning text-warning bg-warning/10"
                    : "border-primary text-primary bg-primary/10";

          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isActive
                  ? accentClass
                  : "border-base-300/50 text-base-content/40 hover:border-base-300 hover:text-base-content/60 bg-transparent"
              }`}
            >
              {label}
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-base-100/40"
                    : "bg-base-300/40 text-base-content/30"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    )}

    {/* No proposals at all */}
    {proposals.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 text-center text-base-content/40">
        <MdInbox size={40} className="mb-3 opacity-50" />
        <p className="text-sm font-medium">No proposals yet</p>
        <p className="text-xs max-w-xs mt-1">
          Browse events and submit a sponsorship proposal to get started.
        </p>
      </div>
    ) : filtered.length === 0 ? (
      /* Filter has no results */
      <div className="flex flex-col items-center justify-center py-16 text-center text-base-content/40">
        <MdInbox size={32} className="mb-2 opacity-40" />
        <p className="text-sm font-medium">No {activeFilter} proposals</p>
      </div>
    ) : (
      <div className="space-y-3">
        {filtered.map((p) => (
          <div
            key={p._id}
            className="bg-base-200 rounded-xl border border-base-300/50 overflow-hidden hover:border-base-300 transition-colors"
          >
            
            <div
              className={`h-0.5 w-full ${
                p.status === "approved"
                  ? "bg-success"
                  : p.status === "rejected"
                    ? "bg-error"
                    : p.status === "negotiating"
                      ? "bg-secondary"
                      : "bg-warning"
              }`}
            />

            <div className="p-4 sm:p-5 space-y-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-base-content leading-snug truncate">
                    {p.event?.title || "—"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <MdOutlineCalendarToday
                      size={10}
                      className="text-base-content/30 shrink-0"
                    />
                    <span className="text-xs text-base-content/40">
                      {p.event?.eventDate
                        ? new Date(p.event.eventDate).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )
                        : "—"}
                    </span>
                    {p.event?.eventType && (
                      <>
                        <span className="text-base-content/20 text-xs">·</span>
                        <span className="text-xs text-base-content/40 capitalize">
                          {p.event.eventType}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>

              
              <div className="border-t border-base-300/30" />

              {/* Tier + Budget + Counter + Date */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Tier pill */}
                <span
                  className={`text-xs px-2.5 py-1 rounded-full ${tierConfig[p.tier]} ${tierBg[p.tier]}`}
                >
                  {p.tier}
                </span>

                {/* Budget */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-base-content/30">
                    Budget
                  </span>
                  <span className="font-mono text-sm font-bold text-base-content">
                    ${p.proposedBudget?.toLocaleString()}
                  </span>
                </div>

                {/* Counter offer */}
                {p.counterOffer > 0 && (
                  <>
                    <span className="text-base-content/20 text-xs">→</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-base-content/30">
                        Counter
                      </span>
                      <span className="font-mono text-sm font-bold text-secondary">
                        ${p.counterOffer.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}

                {/* Submitted date */}
                <div className="ml-auto flex flex-col items-end gap-0.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-base-content/30">
                    Submitted
                  </span>
                  <span className="font-mono text-xs text-base-content/40">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Organizer note */}
              {p.counterNote && (
                <div className="flex items-start gap-2.5 rounded-lg bg-base-300/30 border border-base-300/40 px-3 py-2.5">
                  <FiMessageSquare
                    size={12}
                    className="text-secondary/60 mt-0.5 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-base-content/30">
                      Organizer note
                    </p>
                    <p className="text-xs text-base-content/60 leading-relaxed">
                      {p.counterNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Accept / Decline counter */}
              {p.status === "negotiating" && p.counterStatus === "pending" && (
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-base-300/30">
                  <p className="text-xs text-base-content/40">
                    Respond to the organizer's counter offer
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCounterResponse(p._id, "accept")}
                      className="btn btn-success btn-sm btn-outline h-8 min-h-0 text-xs font-medium px-3"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleCounterResponse(p._id, "reject")}
                      className="btn btn-error btn-sm btn-outline h-8 min-h-0 text-xs font-medium px-3"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default MyProposals;
