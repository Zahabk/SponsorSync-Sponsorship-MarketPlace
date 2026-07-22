import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineEvent,
  MdOutlineAdd,
  MdOutlineSearch,
  MdOutlineFilterList,
} from "react-icons/md";
import { useOrganizerDashboard } from "../context/OrganizerDashboardContext";
import EventCard from "../components/OrganizerDashboard/EventCard";

const MyEvents = () => {
  const { myEvents, loading } = useOrganizerDashboard();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = myEvents.filter((e) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCount = myEvents.filter((e) => e.status === "open").length;
  const closedCount = myEvents.filter((e) => e.status === "closed").length;

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-base-content">
            My Events
          </h1>
          <p className="text-sm text-base-content/50 mt-0.5">
            {myEvents.length} events · {openCount} open · {closedCount} closed
          </p>
        </div>
        <Link
          to="/create-event"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-content text-sm font-semibold hover:bg-primary/80 transition-colors sm:shrink-0 w-full sm:w-auto"
        >
          <MdOutlineAdd size={18} />
          Create event
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <MdOutlineSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-base-200 border border-base-300/40 rounded-xl pl-9 pr-4 py-2.5 text-sm text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-base-200 border border-base-300/40 rounded-xl p-1 shrink-0">
          <MdOutlineFilterList
            size={15}
            className="text-base-content/30 ml-2 mr-1 shrink-0"
          />
          {["all", "open", "closed"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === f
                  ? "bg-base-100 text-base-content shadow-sm"
                  : "text-base-content/40 hover:text-base-content/70"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center">
          <MdOutlineEvent size={32} className="text-base-content/20 mb-3" />
          <p className="text-sm text-base-content/40">
            {search || statusFilter !== "all"
              ? "No events match your filters."
              : "No events yet. Create your first event."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
