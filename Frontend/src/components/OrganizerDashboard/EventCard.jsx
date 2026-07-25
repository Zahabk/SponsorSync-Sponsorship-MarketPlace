import { useState, useRef } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import DeleteEventModal from "./DeleteEventModal";
import EventService from "../../services/event";
import { toast } from "react-toastify";

const EventCard = ({ event, onBannerUpdate }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const tierColors = {
    Gold: "text-amber-400",
    Silver: "text-slate-300",
    Bronze: "text-orange-500",
  };

  const handleBannerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const newBannerFile = e.target.files?.[0];

    if (!newBannerFile) return;
    const localUrl = URL.createObjectURL(newBannerFile);
    setPreview(localUrl);

    const newBanner = new FormData();
    newBanner.append("banner", newBannerFile);

    try {
      setUploading(true);
      await EventService.updateEventBanner(event._id, newBanner);
      toast.success("Event banner changed successfully!!");
      navigate("/dashboard/events");
    } catch (err) {
      console.error("Banner update failed:", err);
      toast.error("Event banner updation failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const bannerSrc = preview || event.banner;

  return (
    <>
      <div className="bg-base-200 rounded-2xl overflow-hidden border border-base-300/30 hover:border-base-300/60 transition-all group">
        {/* Banner */}
        <div className="relative h-36 bg-linear-to-br from-base-300/60 to-base-300/20 flex items-center justify-center overflow-hidden">
          {bannerSrc ? (
            <img
              src={bannerSrc}
              alt={event.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                uploading
                  ? "opacity-40 blur-[1px]"
                  : "opacity-100 group-hover:brightness-75"
              }`}
            />
          ) : (
            <MdOutlineEvent size={40} className="text-base-content/10" />
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            title="Update banner"
            onClick={handleBannerClick}
            disabled={uploading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/30 backdrop-blur-[1px] disabled:cursor-wait"
          >
            {uploading ? (
              <span className="text-xs font-medium text-white/90">
                Uploading…
              </span>
            ) : (
              <>
                <MdOutlineEdit size={20} className="text-white drop-shadow" />
                <span className="text-[11px] font-medium text-white/90 drop-shadow">
                  Change banner
                </span>
              </>
            )}
          </button>

          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${
              event.status === "open"
                ? "bg-emerald-900/60 text-emerald-400 border-emerald-700/30"
                : "bg-base-300/60 text-base-content/40 border-base-300/30"
            }`}
          >
            {event.status}
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
            {event.status === "open" && (
              <Link
                to={`/dashboard/events/${event._id}`}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
              >
                <MdOutlineEdit size={14} /> Edit details
              </Link>
            )}
            <button
              onClick={() =>
                document.getElementById("delete-event").showModal()
              }
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors ${
                event.status === "open" ? "flex-1" : "w-full"
              }`}
            >
              <MdOutlineDelete size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteEventModal modalId="delete-event" event={event} />
    </>
  );
};

export default EventCard;
