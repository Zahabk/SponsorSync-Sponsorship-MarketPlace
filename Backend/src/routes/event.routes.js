import { Router } from "express";
import { authorizeRole, verifyJWT } from "../middlewares/auth.middleware.js";
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

//public
router.route("/").get(getAllEvents);

//organizer only
router
.route("/")
.post(
  verifyJWT,
  authorizeRole("organizer"),
  upload.single("banner"),
  createEvent,
);
router
.route("/my-events")
.get(verifyJWT, authorizeRole("organizer"), getOrganizerEvents);


router.route("/:id").get(verifyJWT, getEvent); //public
router.route("/:id").patch(verifyJWT, authorizeRole("organizer"), updateEvent);
router.route("/:id").delete(verifyJWT, authorizeRole("organizer"), deleteEvent);
router
  .route("/banner/:id")
  .patch(
    verifyJWT,
    authorizeRole("organizer"),
    upload.single("banner"),
    updateBanner,
  );


export default router;

