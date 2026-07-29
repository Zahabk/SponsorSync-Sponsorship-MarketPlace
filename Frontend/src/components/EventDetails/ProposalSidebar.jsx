import { useState } from "react";
import { FiSend } from "react-icons/fi";
import ProposalService from "../../services/proposal";
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom'

const SIDEBAR_NAMES = {
  Gold: "Gold Package",
  Silver: "Silver Package",
  Bronze: "Bronze Package",
};

const ProposalSidebar = ({ event }) => {
  const tiers = event?.tiers || [];
  const [selectedTier, setSelectedTier] = useState({ name: "", price: 0 });
  const [proposedBudget, setProposedBudget] = useState("");
  const [pitch, setPitch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate()

  const handleTierChange = (tier) => {
    setSelectedTier({ name: tier.name, price: tier.price });
    setProposedBudget(tier.price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTier.name) return;

    const proposalDetails = {
      tier: selectedTier.name,
      proposedBudget: Number(proposedBudget),
      message: pitch,
    };

    try {
      const res = await ProposalService.submitProposal(
        event._id,
        proposalDetails,
      );
      console.log(res.data);

      toast.success("Proposal Submitted Successfully!!")
      setSubmitted(true);
      setSelectedTier({ name: "", price: 0 });
      setProposedBudget("");
      setPitch("");
      navigate("/my-proposals")
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 409) {
        toast.error(
          message || "You have already submitted a proposal for this event.",
        );
        navigate("/my-proposals")

      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="rounded-xl border border-base-300 bg-base-200 p-5 shadow-sm">
      <h3 className="mb-4 font-serif text-[16px] font-bold text-base-content">
        Submit a Sponsorship Proposal
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tier Selection */}
        <div className="space-y-2">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-base-content/60">
            Select Package Tier
          </label>
          <div className="grid grid-cols-1 gap-2">
            {tiers.map((tier) => (
              <label
                key={tier.name}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                  selectedTier.name === tier.name
                    ? "border-primary bg-primary/5 text-base-content"
                    : "border-base-300 bg-base-100 text-base-content/70 hover:bg-base-300/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="sidebar-tier"
                    checked={selectedTier.name === tier.name}
                    onChange={() => handleTierChange(tier)}
                    className="radio radio-primary radio-sm"
                  />
                  <span className="text-[13px] font-semibold">
                    {SIDEBAR_NAMES[tier.name] || tier.name}
                  </span>
                </div>
                <span className="font-mono text-[12px] font-bold text-primary">
                  ${tier.price}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Proposed Budget */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-base-content/60">
            Proposed Budget
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-base-content/50">
              $
            </span>
            <input
              type="number"
              min={0}
              value={proposedBudget}
              onChange={(e) => setProposedBudget(e.target.value)}
              placeholder="Enter your budget"
              required
              className="input input-bordered w-full pl-7 text-[13px] font-mono focus:outline-none focus:border-primary"
            />
          </div>
          {selectedTier.price > 0 &&
            Number(proposedBudget) < selectedTier.price && (
              <p className="text-[11px] text-warning/80">
                Below the listed tier price of $
                {selectedTier.price.toLocaleString()}
              </p>
            )}
        </div>

        {/* Pitch Message */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-base-content/60">
            Your Proposal Pitch
          </label>
          <textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Briefly describe what you'd like to bring to this event..."
            rows={4}
            className="textarea textarea-bordered w-full text-[13px] leading-relaxed resize-none focus:outline-none focus:border-primary"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedTier.name || !proposedBudget || submitted}
          className="btn btn-primary btn-block btn-sm h-10 gap-2 font-medium"
        >
          {submitted ? (
            <span className="text-[13px]">Proposal Sent!</span>
          ) : (
            <>
              <FiSend size={13} />
              <span className="text-[13px]">Send Proposal</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ProposalSidebar;
