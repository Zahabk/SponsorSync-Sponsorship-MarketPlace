import cron from "node-cron";
import { Event } from "../models/event.model.js";

const closeExpiredEvents = async () => {
  try {
    await Event.updateMany(
      {
        eventDate: { $lt: new Date() },
        status: "open",
      },
      {
        $set: { status: "closed" },
      },
    );
  } catch (err) {
    console.error("Event status job failed:", err);
  }
};

export const startEventStatusJob = () => {
  closeExpiredEvents();
  cron.schedule("0 0 * * *", closeExpiredEvents, {
    timezone: "UTC",
  });
};
