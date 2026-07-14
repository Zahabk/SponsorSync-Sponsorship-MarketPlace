import React from "react";

const TIER_STYLES = {
  Gold: { badge: "bg-amber-500/15 text-amber-400", border: "border-amber-500/30" },
  Silver: { badge: "bg-slate-400/15 text-slate-300", border: "border-slate-500/30" },
  Bronze: { badge: "bg-orange-700/15 text-orange-400", border: "border-orange-700/30" },
};

const inputCls =
  "input input-bordered w-full bg-base-200 text-sm rounded-lg border border-base-300 focus:outline-primary";

const TierFormCard = ({ tier, index, onChange }) => {
  const s = TIER_STYLES[tier.name];
  return (
    <div className={`rounded-xl border ${s.border} bg-base-100 p-4 flex flex-col gap-3`}>
      <div className={`w-fit text-xs font-bold px-2.5 py-1 rounded-full ${s.badge}`}>
        {tier.name}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-base-content/60">Amount (₹)</label>
        <input
          type="number"
          value={tier.amount}
          onChange={(e) => onChange(index, "amount", e.target.value)}
          placeholder="e.g. 50000"
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-base-content/60">Perks &amp; benefits</label>
        <input
          type="text"
          value={tier.perks}
          onChange={(e) => onChange(index, "perks", e.target.value)}
          placeholder="VIP access, Logo on main stage, Dedicated booth..."
          className={inputCls}
        />
        <p className="text-[10px] text-base-content/30">Separate multiple perks with commas</p>
      </div>
    </div>
  );
};

export default TierFormCard;