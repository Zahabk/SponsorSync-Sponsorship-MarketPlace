import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Event } from "../models/event.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

//create new event
const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    eventType,
    eventDate,
    location,
    audienceSize,
    tiers,
    proposalDeadline,
    status,
  } = req.body;

  if (
    [
      title,
      description,
      eventDate,
      location,
      audienceSize,
      proposalDeadline,
    ].some((field) => field === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (new Date(proposalDeadline) >= new Date(eventDate)) {
    throw new ApiError(400, "Proposal Deadline must be before event date");
  }

  let parsedTiers = [];
  if (tiers) {
    try {
      parsedTiers = typeof tiers === "string" ? JSON.parse(tiers) : tiers;
    } catch (err) {
      throw new ApiError(400, "Invalid tiers format, must be valid JSON");
    }
  }

  const bannerLocalPath = req.file?.path;
  let bannerUrl = "";

  if (bannerLocalPath) {
    const banner = await uploadOnCloudinary(bannerLocalPath);
    if (!banner?.url) {
      throw new ApiError(
        500,
        "Something went wrong while uploading banner on cloudinary",
      );
    }
    bannerUrl = banner.url;
  }

  const createdEvent = await Event.create({
    title,
    description,
    eventType,
    eventDate,
    location,
    audienceSize,
    banner: bannerUrl,
    tiers: parsedTiers,
    proposalDeadline,
    status,
    organizer: req.user?._id,
  });

  const event = await Event.findById(createdEvent._id).populate(
    "organizer",
    "username email",
  );

  return res
    .status(201)
    .json(new ApiResponse(201, "Event created successfully", event));
});

//get event details
const getEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Event fetched Successfully", event));
});

//get all events
const getAllEvents = asyncHandler(async (req, res) => {
  const event = await Event.find({});

  if (!event) {
    throw new ApiError(404, "No Events Found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Events fetched Successfully", event));
});

//update event
const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    eventType,
    eventDate,
    location,
    audienceSize,
    tiers,
    proposalDeadline,
    status,
  } = req.body;

  let parsedTiers;
  if (tiers) {
    try {
      parsedTiers = typeof tiers === "string" ? JSON.parse(tiers) : tiers;
    } catch {
      throw new ApiError(400, "Invalid tiers format, must be valid JSON");
    }
  }

  const event = await Event.findById(id);
  if (!event) throw new ApiError(404, "Event not found");

  if (!event.organizer.equals(req.user?._id)) {
    throw new ApiError(403, "Not authorized to update this event");
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    {
      $set: {
        title,
        description,
        eventType,
        eventDate,
        location,
        audienceSize,
        tiers: parsedTiers,
        proposalDeadline,
        status,
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Event updated successfully", updatedEvent));
});

//delete event
const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (!event.organizer.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to delete this event");
  }

  await event.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Event deleted Successfully", {}));
});

//get particular organizer's event
const getOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user?._id });

  if (!events) {
    throw new ApiError(404, "Events not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Event fetched Successfully", events));
});

//update banner image
const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  const oldBannerUrl = event?.banner;

  if (!event.organizer.equals(req.user?._id)) {
    throw new ApiError(403, "Not authorized to update this event");
  }

  const bannerLocalPath = req.file?.path;
  let bannerUrl = "";

  if (bannerLocalPath) {
    const banner = await uploadOnCloudinary(bannerLocalPath);
    if (!banner?.url) {
      throw new ApiError(
        500,
        "Something went wrong while uploading banner on cloudinary",
      );
    }
    bannerUrl = banner.url;
  }

  const updatedEvent = await event.updateOne(
    {
      $set: {
        banner: bannerUrl,
      },
    },
    { new: true },
  );

  if (oldBannerUrl) {
    const publicId = oldBannerUrl.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Banner updated Successfully", {}));
});

export {
  createEvent,
  getEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  updateBanner,
};
