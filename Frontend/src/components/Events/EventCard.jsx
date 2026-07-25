import { useState } from "react";
import { Link } from "react-router";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { MdOutlineEvent } from "react-icons/md";
import { FcAlarmClock } from "react-icons/fc";

const BADGE_STYLE = {
  conference: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  concert: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  sports: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  festival: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  corporate: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  other: "bg-base-300/50 text-base-content border-base-300/80 font-semibold",
};

const EventCard = ({ event }) => {
  const [hovered, setHovered] = useState(false);

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const startingPrice = event.tiers?.length
    ? Math.min(...event.tiers.map((t) => t.price)).toLocaleString()
    : "0";

  const calculateDaysLeft = (deadlineStr) => {
    if (!deadlineStr) return null;
    const today = new Date();
    const deadline = new Date(deadlineStr);
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft(event.proposalDeadline);

  return (
    <Link
      to={`/events/${event._id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group card bg-base-200 border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        hovered
          ? "border-primary/30 -translate-y-1.5 shadow-xl shadow-primary/5"
          : "border-base-300/30 shadow-sm"
      }`}
    >
      {/* banner  */}
      <figure className="relative h-44 w-full overflow-hidden shrink-0">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              hovered ? "scale-105 filter brightness-95" : "scale-100"
            }`}
          />
        ) : (
          <MdOutlineEvent size={40} className="text-base-content/60" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-base-200 via-transparent to-black/20" />

        {/*Proposal deadline */}
        {daysLeft !== null && (
          <div
            className={`absolute top-3 right-3 font-mono text-[10px] font-bold tracking-wider px-2 py-1 rounded shadow-md backdrop-blur-md border ${
              daysLeft <= 10
                ? "bg-error/20 text-error border-error/30 animate-pulse"
                : "bg-base-300/80 text-base-content border-base-100/20"
            }`}
          >
            <div className="flex items-center gap-1">
              <FcAlarmClock className="text-lg" />
              {daysLeft === 0
                ? "DEADLINE PASSED"
                : `${daysLeft}d LEFT TO APPLY`}
            </div>
          </div>
        )}

        {/* Category */}
        <span
          className={`absolute bottom-3 left-4 font-mono text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full border shadow-sm uppercase ${
            BADGE_STYLE[event.eventType] || BADGE_STYLE.other
          }`}
        >
          ✦ {event.eventType}
        </span>
      </figure>

      {/* ── Content section ── */}
      <div className="card-body p-5 gap-0 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between">
            {/* Title */}
            <h3 className="card-title text-base font-bold  text-base-content mb-1.5 group-hover:text-primary transition-colors duration-200">
              {event.title}
            </h3>

            {/* event status  */}
            <div
              className={`flex justify-center items-center px-6 font-mono font-medium text-xs  rounded-4xl border ${
                event.status === "open"
                  ? "bg-primary/20 border-primary/60 text-primary"
                  : "bg-red-500/20 border-red-500/50 text-red-400"
              }`}
            >
              {event.status}
            </div>
          </div>
          {/* Description */}
          <p className="text-xs text-base-content/60 leading-relaxed line-clamp-2 mb-4 mt-2">
            {event.description}
          </p>
        </div>

        <div>
          {/* Location, Attendees, event date  */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-2 teg-widerxt-[11px] text-base-content/50 border-t border-base-300/40 pt-3.5 mb-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <IoCalendarOutline className="w-4.5 h-4.5 text-primary" />
              <span className="truncate font-medium text-base-content/70">
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
              {" "}
              <IoLocationOutline className="w-4.5 h-4.5 text-secondary/80" />
              <span className="truncate font-medium text-base-content/70">
                {event.location}
              </span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0 col-span-2">
              <IoPeopleOutline className="w-4.5 h-4.5 text-primary" />
              <span className="font-medium text-base-content/70">
                <strong className="text-base-content font-bold">
                  {event.audienceSize?.toLocaleString()}
                </strong>{" "}
                Expected Attendees
              </span>
            </div>
          </div>

          {/* starting tier  */}

          <div className="flex items-center justify-between border-t border-base-300/40 pt-3">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest font-bold text-base-content/40">
                Starting Tier
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs font-bold text-primary">$</span>
                <span className="text-lg font-black tracking-tight text-primary">
                  {startingPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
