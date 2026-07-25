import EventService from "../../services/event";
import { useState } from "react";
import { toast } from "react-toastify";
import { useOrganizerDashboard } from "../../context/OrganizerDashboardContext";

const DeleteEventModal = ({ modalId, event }) => {
  const { refreshEvents } = useOrganizerDashboard();
  const [deleting, setDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleClose = () => {
    document.getElementById(modalId).close();
    setConfirmed(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await EventService.deleteEvent(event._id);
      toast.success("Event deleted successfully!");
      handleClose();
      refreshEvents();
    } catch (err) {
      toast.error("Failed to delete event");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box bg-base-200 border border-base-300/30">
        <h3 className="font-bold text-lg text-base-content">Delete event?</h3>
        <p className="text-sm text-base-content/50 mt-2">
          <span className="text-base-content font-medium">{event.title}</span>{" "}
          will be permanently deleted. This action cannot be undone.
        </p>

        {/* Confirmation checkbox */}
        <label className="flex items-center gap-2 mt-5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="checkbox checkbox-error checkbox-sm"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <span className="text-sm text-base-content/60">
            Yes, I want to delete this event
          </span>
        </label>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleClose}
            className="flex-1 py-2 rounded-xl text-sm font-medium border border-base-300/40 hover:bg-base-300/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirmed || deleting}
            className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setConfirmed(false)}>close</button>
      </form>
    </dialog>
  );
};

export default DeleteEventModal;
