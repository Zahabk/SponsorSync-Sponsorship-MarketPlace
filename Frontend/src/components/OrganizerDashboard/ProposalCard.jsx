import React, { useState } from "react";
import { MdArrowForward } from "react-icons/md";
import ProposalService from "../../services/proposal";
import { toast } from "react-toastify";

const STATUS_STYLE = {
  pending: "bg-warning/15 text-warning border-warning/30",
  negotiating: "bg-secondary/15 text-secondary border-secondary/30",
  approved: "bg-success/15 text-success border-success/30",
  rejected: "bg-error/15 text-error border-error/30",
};
const TIER_STYLE = {
  Gold: "text-amber-400",
  Silver: "text-slate-300",
  Bronze: "text-orange-500",
};

const ProposalCard = ({ proposal }) => {
  const [showCounter, setShowCounter] = useState(false);
  const [isEditingCounter, setIsEditingCounter] = useState(false);
  const [counterDetails, setCounterDetails] = useState({
    counterOffer: "",
    counterNote: "",
  });

  const isNegotiating = proposal.status === "negotiating";
  const isSettled = ["approved", "rejected"].includes(proposal.status);
  const canEditCounter = isNegotiating && proposal.counterStatus === "pending";
  const tierPrice = proposal.event.tiers.find((t) => t.name === proposal.tier).price;

  const hasAcceptedCounter = proposal.counterOffer > 0 && proposal.counterStatus === "accepted";
  const confirmedPrice = hasAcceptedCounter ? proposal.counterOffer : proposal.proposedBudget;

  const handleApprove =async () => {
    try {
        await ProposalService.decisionOnProposal(proposal._id,"approve")
        toast.success("Propsal approved sucessfully")
    } catch (error) {
        toast.error("Failed to approve proposal")
    }
};

const handleReject =async () => {
    try {
        await ProposalService.decisionOnProposal(proposal._id,"reject")
        toast.success("Propsal rejected sucessfully")
      } catch (error) {
        toast.error("Failed to reject proposal")
      }
  };

  const openNewCounter = () => {
    setCounterDetails({ counterOffer: "", counterNote: "" });
    setIsEditingCounter(false);
    setShowCounter(true);
  };

  const openEditCounter = () => {
    setCounterDetails({
      counterOffer: proposal.counterOffer ?? "",
      counterNote: proposal.counterNote ?? "",
    });
    setIsEditingCounter(true);
    setShowCounter(true);
  };

  const closeCounterForm = () => {
    setShowCounter(false);
    setIsEditingCounter(false);
  };

  const handleSaveCounter = async () => {
    try {
      if (isEditingCounter) {
        await ProposalService.organizerUpdateCounter(
          proposal._id,
          counterDetails,
        );
        toast.success("Counter offer updated successfully");
      } else {
        await ProposalService.organizerSendCounter(
          proposal._id,
          counterDetails,
        );
        toast.success("Counter offer sent successfully");
      }
      closeCounterForm();
    } catch (error) {
      toast.error(
        isEditingCounter
          ? "Failed to update counter"
          : "Failed to send counter",
      );
    }
  };

  return (
    <div
      className={`bg-base-200 rounded-2xl border overflow-hidden transition-all ${
        isNegotiating
          ? "border-secondary/30"
          : proposal.status === "approved"
            ? "border-success/20"
            : proposal.status === "rejected"
              ? "border-error/20"
              : "border-base-300/30"
      }`}
    >
    
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold text-base-content leading-snug">
            {proposal.event?.title}
          </h3>
          <div className="text-right shrink-0">
            {proposal.status === "approved" ? (
              <>
                <p className="text-sm sm:text-base font-bold text-success">
                  ${confirmedPrice.toLocaleString("en-US")}
                </p>
                <p className="text-[10px] text-base-content/40 whitespace-nowrap">
                  {hasAcceptedCounter ? " · counter accepted" : ""}
                </p>
              </>
            ) : isNegotiating && proposal.counterOffer ? (
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
                <p className="text-sm sm:text-base font-bold text-base-content">
                  ${proposal.proposedBudget.toLocaleString("en-US")}
                </p>
                <p className="text-[10px] text-base-content/40">proposed</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[proposal.status]}`}
          >
            {proposal.status}
          </span>
          <p className="text-xs text-base-content/50">
            {proposal.sponsor.firstName} {proposal.sponsor.lastName}
            <span className={`font-semibold ml-3 ${TIER_STYLE[proposal.tier]}`}>
              ★ {proposal.tier} - ${tierPrice}
            </span>
          </p>
        </div>
      </div>

      {/* Message */}
      {proposal.message && (
        <div className="px-3 sm:px-4 py-2.5 border-t border-base-300/30 bg-base-300/10 text-xs text-base-content/50 italic">
          "{proposal.message}"
        </div>
      )}

      {/* Counter note */}
      {isNegotiating && proposal.counterNote && !showCounter && (
        <div className="px-3 sm:px-4 py-2.5 border-t border-base-300/30 bg-secondary/5 text-xs text-base-content/50">
          Counter note:{" "}
          <span className="text-base-content/80 not-italic">
            {proposal.counterNote}
          </span>
        </div>
      )}

      {/* Counter form (new or edit) */}
      {showCounter && (
        <div className="px-3 sm:px-4 py-3 border-t border-base-content/40 bg-base-300/50 space-y-2">
          <p className="text-sm text-base-content/80">
            {isEditingCounter ? "Edit Counter Offer" : "Counter Offer"}
          </p>
          <input
            type="number"
            placeholder="Counter amount ($)"
            value={counterDetails.counterOffer}
            onChange={(e) =>
              setCounterDetails((prev) => ({
                ...prev,
                counterOffer: e.target.value,
              }))
            }
            className="w-full bg-base-100 border border-base-300/40 rounded-lg px-3 py-2 text-xs text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-secondary/50 transition-colors"
          />
          <textarea
            placeholder="Add a note (optional)"
            value={counterDetails.counterNote}
            onChange={(e) =>
              setCounterDetails((prev) => ({
                ...prev,
                counterNote: e.target.value,
              }))
            }
            rows={2}
            className="w-full bg-base-100 border border-base-300/40 rounded-lg px-3 py-2 text-xs text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-secondary/50 transition-colors resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveCounter}
              className="flex-1 py-2 rounded-lg text-xs font-medium bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 transition-colors"
            >
              {isEditingCounter ? "Update counter" : "Send counter"}
            </button>
            <button
              onClick={closeCounterForm}
              className="flex-1 py-2 rounded-lg text-xs font-medium border text-base-content/40 hover:text-base-content/70 transition-colors"
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
          {isNegotiating ? (
            canEditCounter && (
              <button
                onClick={openEditCounter}
                className="flex-1 py-2 rounded-lg text-xs font-medium border border-base-300 bg-base-300/50 text-base-content/50 hover:text-base-content/80 transition-colors"
              >
                Edit counter
              </button>
            )
          ) : (
            <button
              onClick={openNewCounter}
              className="flex-1 py-2 rounded-lg text-xs font-medium border border-base-300 bg-base-300/50 text-base-content/50 hover:text-base-content/80 transition-colors"
            >
              Counter
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default ProposalCard;
