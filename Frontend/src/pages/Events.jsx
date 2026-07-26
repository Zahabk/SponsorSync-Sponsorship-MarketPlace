import { useState, useEffect, useCallback } from "react";
import EventCard from "../components/Events/EventCard";
import Pagination from "../components/Events/Pagination";
import EventService from "../services/event";

const Events = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const currentData = allEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const fetchEvents = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await EventService.getAllEvents();
      setAllEvents(res.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        fetchEvents(false);
      }
    };
    const onFocus = () => fetchEvents(false);

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchEvents]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      {/* ── Main Content Container ── */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-16 max-w-7xl mx-auto w-full">
        <h1 className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6 tracking-tight">
          Browse Events
        </h1>

        {currentData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-base-content/50">
            <p className="text-sm">No events found at the moment.</p>
          </div>
        ) : (
          // Event cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {currentData.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </main>

      {/* Pagination */}

      <Pagination
        totalItems={allEvents.length}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default Events;
