import {
  MdOutlineEvent,
  MdOutlineLocationOn,
  MdOutlinePeople,
  MdOutlineCalendarToday,
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineAccessTime,
  MdOutlineStar,
} from "react-icons/md";
import { Link } from "react-router-dom";

const EventCard = ({ event, onDeleteClick}) => {
  const tierColors = {
    Gold: "text-amber-400",
    Silver: "text-slate-300",
    Bronze: "text-orange-500",
  };

  return (
    <div className="bg-base-200 rounded-2xl overflow-hidden border border-base-300/30 hover:border-base-300/60 transition-all group">
      {/* Banner */}
      {/* Banner */}
      <div className="relative h-36 bg-linear-to-br from-base-300/60 to-base-300/20 flex items-center justify-center overflow-hidden">
        {event.banner ? (
          <img
            src={event.banner}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <MdOutlineEvent size={40} className="text-base-content/10" />
        )}

        {/* Banner edit */}
        <button
          title="Update banner"
          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-base-100/70 text-base-content/60 border border-base-300/30 backdrop-blur-sm hover:text-primary hover:border-primary/30 transition-colors"
        >
          <MdOutlineEdit size={14} />
        </button>

        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            event.status === "open"
              ? "bg-emerald-900/60 text-emerald-400 border-emerald-700/30"
              : "bg-base-300/60 text-base-content/40 border-base-300/30"
          }`}
        >
          {event.status === "open" ? "Open" : "Closed"}
        </span>
        <span className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full bg-base-100/70 text-base-content/60 border border-base-300/30 backdrop-blur-sm">
          {event.eventType}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-base text-base-content mb-1 truncate group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-xs text-base-content/50 line-clamp-2 mb-4 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <MdOutlineCalendarToday size={13} className="shrink-0" />
            <span>
              {new Date(event.eventDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <MdOutlineLocationOn size={13} className="shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <MdOutlinePeople size={13} className="shrink-0" />
            <span>
              {event.audienceSize.toLocaleString("en-IN")} expected attendees
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <MdOutlineAccessTime size={13} className="shrink-0" />
            <span>
              Deadline:{" "}
              {new Date(event.proposalDeadline).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 mb-4">
          {event.tiers.map((t) => (
            <div
              key={t.name}
              className="flex flex-col px-2 py-1.5 rounded-lg border border-base-300/20 bg-base-300/20"
            >
              <span
                className={`flex items-center gap-1 text-xs font-semibold ${tierColors[t.name]}`}
              >
                <MdOutlineStar size={10} /> {t.name}
              </span>
              <span className="text-xs font-bold mt-0.5 text-base-content/50">
                ${t.price.toLocaleString("en-US")}
              </span>
            </div>
          ))}
        </div>

        {/* ── Edit / Delete ── */}
        <div className="flex items-center gap-2 pt-3 border-t border-base-300/30">
          <Link
            to={`/dashboard/events/${event._id}/edit`}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <MdOutlineEdit size={14} /> Edit details
          </Link>
          <button
            onClick={() => onDeleteClick(event)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors"
          >
            <MdOutlineDelete size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
