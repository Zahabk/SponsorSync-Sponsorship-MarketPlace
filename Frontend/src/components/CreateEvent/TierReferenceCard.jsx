import React from "react";

const TIER_STYLES = {
  Gold: { badge: "bg-amber-500/15 text-amber-400", border: "border-amber-500/30" },
  Silver: { badge: "bg-slate-400/15 text-slate-300", border: "border-slate-500/30" },
  Bronze: { badge: "bg-orange-700/15 text-orange-400", border: "border-orange-700/30" },
};

const TierReferenceCard = ({ tier }) => {
  const s = TIER_STYLES[tier.name];
  return (
    <div className={`rounded-lg border ${s.border} bg-base-100 p-3 flex flex-col gap-2`}>
      <div className="flex items-center justify-between gap-2">
        <div className={`w-fit text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
          {tier.name}
        </div>
        <span className="text-sm font-semibold text-base-content">
          ${tier.price.toLocaleString()}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {tier.benefits.map((benefit, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-base-content/70">
            <span className="text-primary mt-0.5">✓</span>
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierReferenceCard;