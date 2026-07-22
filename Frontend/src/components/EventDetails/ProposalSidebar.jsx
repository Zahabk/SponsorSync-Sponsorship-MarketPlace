import { useState } from "react";
import { FiSend } from "react-icons/fi";

const SIDEBAR_NAMES = {
  Gold: "Gold Package",
  Silver: "Silver Package",
  Bronze: "Bronze Package",
};

const ProposalSidebar = ({ event, onSubmit, submitted }) => {
  const tiers = event?.tiers || [];
  const [selectedTier, setSelectedTier] = useState("");
  const [pitch, setPitch] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTier) return;

    // const chosenTierObj = activeTiers.find((t) => t.name === selectedTier);

    // onSubmit?.({
    //   tier: selectedTier,
    //   budget: chosenTierObj?.price || 0,
    //   pitch: pitch,
    // });
    submitted = true;
    console.log(
      `Selected tier: ${selectedTier} and message: ${pitch}, ${submitted}`,
    );

    // Reset fields on success
    setSelectedTier("");
    setPitch("");
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
                  selectedTier === tier.name
                    ? "border-primary bg-primary/5 text-base-content"
                    : "border-base-300 bg-base-100 text-base-content/70 hover:bg-base-300/40"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="sidebar-tier"
                    checked={selectedTier === tier.name}
                    onChange={() => setSelectedTier(tier.name)}
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

        {/* Pitch Message */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono uppercase tracking-wider text-base-content/60">
            Your Proposal Pitch
          </label>
          <textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            placeholder="Briefly describe what you'd like to bring to this event..."
            required
            rows={4}
            className="textarea textarea-bordered w-full text-[13px] leading-relaxed resize-none focus:outline-none focus:border-primary"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedTier || submitted}
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
