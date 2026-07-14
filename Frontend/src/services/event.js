import Api from "./api.js";

const EventService = {
  createEvent: async (eventData) => {
    const res = await Api.post("events/", eventData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  getAllEvents: async () => {
    const res = await Api.get("events/");
    return res.data;
  },
  getOrganizerEvents: async () => {
    const res = await Api.get("events/my-events");
    return res;
  },
  getEventDetails: async (eventId) => {
    const res = await Api.get(`events/${eventId}`);
    return res.data;
  },
  updateEvent: async (eventId, updatedDetails) => {
    const res = await Api.patch(`events/${eventId}`, updatedDetails, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  },
  updateEventBanner: async (eventId, newBanner) => {
    const res = await Api.patch(`events/banner/${eventId}`, newBanner, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res;
  },
  deleteEvent: async (eventId) => {
    const res = await Api.delete(`events/${eventId}`);
    return res;
  },
};

export default EventService;
