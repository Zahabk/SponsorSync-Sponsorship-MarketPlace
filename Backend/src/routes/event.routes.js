import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEvent,
  getOrganizerEvents,
  updateBanner,
  updateEvent,
} from "../controllers/event.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, upload.single("banner"), createEvent);
router.route("/").get(getAllEvents);
router.route("/:id").get(verifyJWT, getEvent);
router.route("/:id").patch(verifyJWT, updateEvent);
router.route("/:id").delete(verifyJWT, deleteEvent);
router.route("/banner/:id").patch(verifyJWT, upload.single("banner"), updateBanner);
router.route("/mine").get(verifyJWT, getOrganizerEvents);

export default router;

// POST   /api/events
// GET    /api/events
// GET    /api/events/:id
// PUT    /api/events/:id
// DELETE /api/events/:id
// GET    /api/events/mine
