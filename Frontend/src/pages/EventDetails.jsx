import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiCalendar, FiMapPin, FiUsers, FiClock } from "react-icons/fi";
import EventService from "../services/event";
import TierCard from "../components/EventDetails/TierCard";
import ProposalSidebar from "../components/EventDetails/ProposalSidebar";
import { useAuth } from "../context/AuthContext";

const TIER_ORDER = ["Bronze", "Gold", "Silver"];
const fmtDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const EventDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await EventService.getEventDetails(id);
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        console.log("Failed to load event. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  const eventDate = fmtDate(event.eventDate);
  const deadline = fmtDate(event.proposalDeadline);

  const orderedTiers = TIER_ORDER.map((name) =>
    event.tiers?.find((t) => t.name === name),
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-base-100 font-sans">
      {/* Banner  */}
      <div className="relative min-h-90 sm:h-80 overflow-hidden flex items-end">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 h-full w-full bg-linear-to-br from-[#0f1f3d] via-[#0a1628] to-[#060d1a]">
            <div className="pointer-events-none absolute -top-15 left-[10%] sm:left-[30%] h-75 w-[90%] sm:w-125 bg-[radial-gradient(ellipse,rgba(45,212,191,0.12)_0%,transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-10 right-[5%] sm:right-[20%] h-55 w-[80%] sm:w-90 bg-[radial-gradient(ellipse,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
            <span className="absolute right-4 top-4 select-none text-[64px] sm:text-[72px] opacity-[.10] text-white">
              ◈
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-900/10 via-slate-900/60 to-slate-900" />

        {/* back button  */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors"
        >
          ← Back
        </button>
        {/* Hero content */}
        <div className="relative w-full flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 sm:px-8 pb-6 pt-24 z-10">
          <div className="flex-1 min-w-0">
            <div className="mb-2.5 flex items-center gap-2.5 flex-wrap">
              <span className="rounded-full bg-primary px-2.25 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[.06em] text-primary-content">
                {event.eventType}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-base-content">
                <FiCalendar size={12} className="text-primary" /> {eventDate}
              </span>
            </div>

            <h1 className="mb-2 font-serif font-extrabold leading-[1.2] text-white text-[24px] sm:text-[30px] md:text-[36px] tracking-tight wrap-break-word">
              {event.title}
            </h1>

            <p className="max-w-130 text-[13.5px] leading-normal text-white/70">
              Join {event.audienceSize} industry leaders for this{" "}
              {event.eventType.toLowerCase()} event.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-end rounded-[10px] border border-white/10 bg-slate-900/40 p-3 backdrop-blur-sm w-full sm:w-auto md:max-w-xs">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <FiMapPin size={14} />
            </div>
            <div className="min-w-0">
              <div className="font-serif text-[13px] font-bold text-white truncate">
                {event.location}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-290 px-4 sm:px-6 py-6 sm:py-8 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* ── MAIN CONTENT ── */}
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-4">
            {[
              {
                icon: <FiCalendar size={13} />,
                label: "Event date",
                value: eventDate,
              },
              {
                icon: <FiClock size={13} />,
                label: "Proposals close",
                value: deadline,
              },
              {
                icon: <FiUsers size={13} />,
                label: "Audience",
                value: event.audienceSize,
              },
              {
                icon: <FiMapPin size={13} />,
                label: "Location",
                value: event.location,
              },
            ].map(
              ({ icon, label, value }) =>
                value && (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg border border-base-300 bg-base-200 p-2.5 sm:px-3 sm:py-2 min-w-0"
                  >
                    <span className="text-primary shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <div className="font-mono text-[9px] uppercase tracking-wider text-base-content/50 truncate">
                        {label}
                      </div>
                      <div className="text-[12px] font-semibold text-base-content truncate">
                        {value}
                      </div>
                    </div>
                  </div>
                ),
            )}
          </div>

          {/* Event Overview */}
          <section>
            <h2 className="mb-4 flex items-center gap-2.5 font-serif text-[18px] sm:text-[20px] font-extrabold tracking-tight text-base-content">
              <span className="inline-block h-5 w-0.75 shrink-0 rounded-sm bg-primary" />
              Event Overview
            </h2>
            <div className="space-y-4">
              <p className="text-[14px] sm:text-[15px] leading-relaxed text-base-content/80">
                {event.description}
              </p>
            </div>
          </section>

          {/* Sponsorship Tiers */}
          <section>
            <h2 className="mb-4 flex items-center gap-2.5 font-serif text-[18px] sm:text-[20px] font-extrabold text-base-content">
              <span className="inline-block h-5 w-0.75 shrink-0 rounded-sm bg-primary" />
              Sponsorship Packages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {orderedTiers.map((tier) => (
                <TierCard key={tier.name} tier={tier} />
              ))}
            </div>
          </section>
        </div>

        {/* Proposal Sidebar */}
        <aside className="lg:sticky lg:top-6 w-full">
          {event.status === "closed" ? (
            <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border border-red-500/30 bg-red-500/10 text-center">
              <div className="text-5xl">🔒</div>
              <div>
                <h3 className="text-lg font-semibold text-red-400 font-mono uppercase tracking-wide">
                  Event Closed
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {user?.role === "sponsor"
                    ? "The sponsorship window has closed. You can no longer submit proposals for this event."
                    : "This event has ended."}
                </p>
              </div>
              <div className="w-full border-t border-red-500/20 pt-4 text-xs text-muted-foreground">
                Event took place on{" "}
                <span className="text-red-400 font-medium">
                  {new Date(event.eventDate).toDateString()}
                </span>
              </div>
            </div>
          ) : user?.role === "sponsor" ? (
            <ProposalSidebar event={event} />
          ) : null}
        </aside>
      </div>
    </div>
  );
};

export default EventDetails;
