import React, { useCallback, useEffect, useState } from "react";
import { MdInbox } from "react-icons/md";
import ProposalService from "../services/proposal";
import { toast } from "react-toastify";
import { FiRefreshCw } from "react-icons/fi";
import MyProposalCard from "../components/MyProposalCard";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "negotiating", label: "Negotiating" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

const filterAccent = {
  all: "border-primary text-primary bg-primary/10",
  approved: "border-success text-success bg-success/10",
  rejected: "border-error text-error bg-error/10",
  negotiating: "border-secondary text-secondary bg-secondary/10",
  pending: "border-warning text-warning bg-warning/10",
};

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchProposals = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await ProposalService.getMyProposal();
      setProposals(res.data || []);
    } catch (err) {
      if (err?.response?.status === 404) {
        setProposals([]);
      } else {
        toast.error("Failed to load proposals. Please try again.");
      }
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        fetchProposals(false);
      }
    };
    const onFocus = () => fetchProposals(false);

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchProposals]);

  const handleManualRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await fetchProposals(false);
    setRefreshing(false);
  };

  const handleCounterResponse = async (proposalId, action) => {
    try {
      await ProposalService.respondToCounter(proposalId, action);
      await fetchProposals(false);
      toast.success(
        action === "accept"
          ? "Counter offer accepted."
          : "Counter offer declined.",
      );
    } catch (err) {
      toast.error("Failed to update response. Please try again.");
    }
  };

  const handleUpdateProposal = async (proposalId, updateDetails) => {
    try {
      await ProposalService.updateProposal(proposalId, updateDetails);
      await fetchProposals(false);
      toast.success("Proposal updated successfully!!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update proposal.");
      throw err;
    }
  };

  const filtered =
    activeFilter === "all"
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
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-7">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-base-content tracking-tight">
            My Proposals
          </h1>
          <p className="text-sm text-base-content/50">
            Track and respond to your sponsorship proposals.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          title="Refresh"
          className="btn btn-ghost btn-sm h-8 min-h-0 w-8 p-0 text-base-content/50 hover:text-base-content shrink-0"
        >
          <FiRefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filter bar */}
      {proposals.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map(({ key, label }) => {
            const count =
              key === "all"
                ? proposals.length
                : proposals.filter((p) => p.status === key).length;
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? filterAccent[key]
                    : "border-base-300/40 text-base-content/60 hover:text-base-content/60 hover:border-base-300/70"
                }`}
              >
                {label}
                <span
                  className={`font-sans text-[10px] px-1 py-0.5 rounded min-w-4 text-center ${
                    isActive ? "bg-black/10" : "text-base-content/40"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-12 h-12 rounded-2xl bg-base-200 border border-base-300/40 flex items-center justify-center mb-4">
            <MdInbox size={22} className="text-base-content/30" />
          </div>
          <p className="text-sm font-semibold text-base-content/60">
            No proposals yet
          </p>
          <p className="text-xs text-base-content/50 mt-1 max-w-55 leading-relaxed">
            Browse events and submit a sponsorship proposal to get started.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MdInbox size={28} className="text-base-content/30 mb-3" />
          <p className="text-sm text-base-content/40">
            No {activeFilter} proposals
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const tierPrice = p.event?.tiers?.find(
              (t) => t.name === p.tier,
            )?.price;

            return (
              <MyProposalCard
                key={p._id}
                proposal={p}
                tierPrice={tierPrice}
                handleCounterResponse={handleCounterResponse}
                handleUpdateProposal={handleUpdateProposal}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProposals;
