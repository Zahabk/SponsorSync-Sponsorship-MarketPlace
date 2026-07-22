import { FiCheckCircle } from "react-icons/fi";

const TIER_COLOR = {
  Gold: {
    accent: "#2dd4bf",
    bg: "rgba(45,212,191,.07)",
    border: "rgba(45,212,191,.35)",
  },
  Silver: {
    accent: "#94a3b8",
    bg: "rgba(148,163,184,.06)",
    border: "rgba(148,163,184,.2)",
  },
  Bronze: {
    accent: "#f59e0b",
    bg: "rgba(245,158,11,.06)",
    border: "rgba(245,158,11,.2)",
  },
};

const TIER_LABEL = {
  Gold: "Premium",
  Silver: "Standard",
  Bronze: "Starter",
};
const TIER_TAG = {
  Gold: "Most Impactful",
};

const TierCard = ({ tier }) => {
  const colors = TIER_COLOR[tier.name];
  const label = TIER_LABEL[tier.name] ?? "";
  const tag = TIER_TAG[tier.name] ?? null;
  const isHighlight = !!tag;

  return (
    <div
      className="relative flex flex-1 flex-col rounded-xl p-5.5 min-w-0"
      style={{
        background: isHighlight ? colors.bg : "rgba(14,21,37,.6)",
        border: `1.5px solid ${isHighlight ? colors.border : "#1e2d47"}`,
      }}
    >
      {/* Floating badge — Gold only */}
      {tag && (
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap
                     rounded-full px-2.5 py-0.75 text-[9px] font-bold
                     uppercase tracking-widest font-mono"
          style={{ background: colors.accent, color: "#042f2e" }}
        >
          {tag}
        </div>
      )}

      {/* Label */}
      <span
        className="mb-1 block font-mono text-[9px] font-medium uppercase"
        style={{ color: colors.accent }}
      >
        {label}
      </span>

      {/* Tier name */}
      <h3 className="mb-1 font-mono text-[22px] font-extrabold text-base-content">
        {tier.name}
      </h3>

      {/* Price */}
      <div className="mb-5 flex items-baseline gap-1">
        <span className="font-serif text-[26px] font-extrabold">
          <span className="text-lg">$ </span>
          {tier.price}
        </span>
        <span className="text-xs text-base-content/40">/event</span>
      </div>

      {/* Benefits */}
      <ul className="flex flex-col gap-2.5">
        {tier.benefits.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <FiCheckCircle
              size={15}
              className="mt-px shrink-0"
              style={{ color: colors.accent }}
            />
            <span className="text-[13px] leading-relaxed text-base-content/60">
              {b}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TierCard;
