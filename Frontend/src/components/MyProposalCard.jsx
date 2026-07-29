import React, { useState } from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import { FiMessageSquare, FiArrowRight, FiEdit2, FiX } from "react-icons/fi";
import StatusBadge from "./StatusBadge";

const tierConfig = {
  Gold: "text-amber-400",
  Silver: "text-slate-300",
  Bronze: "text-orange-500",
};

const tierBorder = {
  Gold: "border-amber-400/30 bg-amber-400/5",
  Silver: "border-slate-300/30 bg-slate-300/5",
  Bronze: "border-orange-500/30 bg-orange-500/5",
};

const statusBar = {
  approved: "bg-success",
  rejected: "bg-error",
  negotiating: "bg-secondary",
  pending: "bg-warning",
};

const MyProposalCard = ({
  proposal,
  tierPrice,
  handleCounterResponse,
  handleUpdateProposal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    tier: proposal.tier,
    proposedBudget: proposal.proposedBudget,
    message: proposal.message || "",
  });
  const [saving, setSaving] = useState(false);

  const availableTiers = proposal.event?.tiers || [];
  const canEdit = proposal.status === "pending";

  const startEdit = () => {
    setForm({
      tier: proposal.tier,
      proposedBudget: proposal.proposedBudget,
      message: proposal.message || "",
    });
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const saveEdit = async () => {
    if (!form.proposedBudget || Number(form.proposedBudget) <= 0) return;
    setSaving(true);
    try {
      await handleUpdateProposal(proposal._id, {
        tier: form.tier,
        proposedBudget: Number(form.proposedBudget),
        message: form.message,
      });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-2xl border border-base-300/40 overflow-hidden hover:border-base-300/70 transition-colors duration-150">
      {/* Status bar */}
      <div
        className={`h-0.75 w-full ${statusBar[proposal.status] ?? "bg-base-300"}`}
      />

      <div className="p-4 sm:p-5 space-y-4">
        {/* Title, event date, event type */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-base-content truncate leading-snug">
              {proposal.event?.title || "—"}
            </p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <MdOutlineCalendarToday
                size={10}
                className="text-base-content/40 shrink-0"
              />
              <span className="text-[11px] text-base-content/60">
                {proposal.event?.eventDate
                  ? new Date(proposal.event.eventDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )
                  : "—"}
              </span>
              {proposal.event?.eventType && (
                <>
                  <span className="text-base-content/40">·</span>
                  <span className="text-[11px] text-base-content/60 capitalize">
                    {proposal.event.eventType}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {canEdit && !isEditing && (
              <button
                onClick={startEdit}
                className="btn btn-ghost btn-xs h-7 min-h-0 px-2 text-base-content/50 hover:text-base-content"
                title="Edit proposal"
              >
                <FiEdit2 size={12} />
              </button>
            )}
            <StatusBadge status={proposal.status} />
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3 rounded-xl border border-base-300/40 bg-base-300/30 p-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-base-content/60">
                  Tier
                </label>
                <select
                  value={form.tier}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tier: e.target.value }))
                  }
                  className="select select-bordered select-sm h-8 min-h-0 text-xs"
                >
                  {availableTiers.length > 0 ? (
                    availableTiers.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name} · ${t.price?.toLocaleString()}
                      </option>
                    ))
                  ) : (
                    <option value={form.tier}>{form.tier}</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-widest text-base-content/60">
                  Proposed budget
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.proposedBudget}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, proposedBudget: e.target.value }))
                  }
                  className="input input-bordered input-sm h-8 min-h-0 text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] uppercase tracking-widest text-base-content/60">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                rows={2}
                className="textarea textarea-bordered text-xs resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="btn btn-ghost btn-sm h-8 min-h-0 text-xs px-3"
              >
                <FiX size={12} className="mr-1" />
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="btn btn-primary btn-sm h-8 min-h-0 text-xs px-4"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
            {/* Tier */}
            <div
              className={`flex flex-col gap-0.5 px-3 py-2 rounded-xl border ${tierBorder[proposal.tier]}`}
            >
              <span className="font-mono text-[9px] uppercase tracking-widest text-base-content/60">
                Tier
              </span>
              <span
                className={`text-xs font-bold ${tierConfig[proposal.tier]}`}
              >
                {proposal.tier}
                {tierPrice != null && (
                  <span className="text-base-content/60 font-normal ml-1">
                    · ${tierPrice.toLocaleString()}
                  </span>
                )}
              </span>
            </div>

            {/* Proposed budget */}
            <div className="flex flex-col gap-0.5 px-3 py-2 rounded-xl border border-base-300/30 bg-base-300/50">
              <span className="font-mono text-[9px] uppercase tracking-widest text-base-content/60">
                Your Offer
              </span>
              <span className="text-xs font-bold text-base-content">
                ${proposal.proposedBudget?.toLocaleString() ?? "—"}
              </span>
            </div>

            {/* Counter offer */}
            {proposal.counterOffer > 0 && (
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <FiArrowRight
                  size={12}
                  className="text-base-content/40 shrink-0"
                />
                <div className="flex flex-col gap-0.5 px-3 py-2 rounded-xl border border-secondary/20 bg-secondary/5 flex-1 sm:flex-none">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-secondary/80">
                    Counter
                  </span>
                  <span className="text-xs font-bold text-secondary">
                    ${proposal.counterOffer.toLocaleString()}
                    <span className="text-xs font-bold text-base-content ml-1">
                      {proposal.counterStatus}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Submitted date */}
            <div className="flex flex-col gap-0.5 px-3 py-2 rounded-xl border border-base-300/30 bg-base-300/50 col-span-2 sm:col-span-1 sm:ml-auto">
              <span className="font-mono text-[9px] uppercase tracking-widest text-base-content/60">
                Submitted
              </span>
              <span className="text-xs text-base-content/80">
                {new Date(proposal.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Organizer note */}
        {proposal.counterNote && (
          <div className="flex items-start gap-2.5 rounded-xl bg-base-300/30 border border-base-300/50 px-3.5 py-3">
            <FiMessageSquare
              size={12}
              className="text-secondary/50 mt-0.5 shrink-0"
            />
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-base-content/60 mb-1">
                Organizer note
              </p>
              <p className="text-xs text-base-content/80 leading-relaxed">
                {proposal.counterNote}
              </p>
            </div>
          </div>
        )}

        {/* Accept / Decline counter */}
        {proposal.status === "negotiating" &&
          proposal.counterStatus === "pending" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-base-300/30">
              <p className="text-xs text-base-content/40 leading-relaxed">
                The organizer sent a counter offer. Accept or decline to
                continue.
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCounterResponse(proposal._id, "accept")}
                  className="btn btn-success btn-sm btn-outline h-8 min-h-0 text-xs px-4"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleCounterResponse(proposal._id, "reject")}
                  className="btn btn-error btn-sm btn-outline h-8 min-h-0 text-xs px-4"
                >
                  Decline
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default MyProposalCard;
