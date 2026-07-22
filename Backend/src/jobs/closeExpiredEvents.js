import cron from "node-cron";
import { Event } from "../models/event.model.js";

export const startEventStatusJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await Event.updateMany(
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
  });
};
