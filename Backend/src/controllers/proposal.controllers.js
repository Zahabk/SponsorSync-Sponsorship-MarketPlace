import { Proposal } from "../models/proposal.model.js";
import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { trusted } from "mongoose";

//sponsor only
const submitProposal = asyncHandler(async (req, res) => {
  const sponsorId = req.user._id;
  const { eventId } = req.params;
  const { tier, proposedBudget, message } = req.body;

  if (!proposedBudget || !tier) {
    throw new ApiError(400, "Proposed budget, and tier are required");
  }

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  const existing = await Proposal.findOne({
    event: eventId,
    sponsor: sponsorId,
  });

  if (existing) {
    throw new ApiError(
      409,
      "You have already submitted a proposal for this event",
    );
  }

  const proposal = await Proposal.create({
    event: eventId,
    sponsor: sponsorId,
    tier,
    proposedBudget,
    message,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Proposal submitted successfully", proposal));
});

const getMyProposal = asyncHandler(async (req, res) => {
  const allProposals = await Proposal.find({ sponsor: req.user._id })
    .populate("event", "title eventDate eventType location")
    .sort({ createdAt: -1 });

  if (allProposals.length === 0) {
    throw new ApiError(404, "No proposals found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Proposals fetched successfully", allProposals));
});

const updateProposal = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const { proposedBudget, tier, message } = req.body;

  const proposal = await Proposal.findById(proposalId);

  if (!proposal) {
    throw new ApiError(404, "No proposals found");
  }

  if (!proposal.sponsor.equals(req.user?._id)) {
    throw new ApiError(403, "Not authorized to update this proposal");
  }
  if (["negotiating", "accepted", "rejected"].includes(proposal.status)) {
    throw new ApiError(400, "Cannot update proposal");
  }

  const updatedProposal = await Proposal.findByIdAndUpdate(
    proposalId,
    {
      $set: {
        tier,
        proposedBudget,
        message,
      },
    },
    { returnDocument: "after" },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Proposals updated successfully", updatedProposal),
    );
});

const sponsorRespondToCounter = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const { action } = req.params;

  const proposal = await Proposal.findById(proposalId);
  if (!proposal) {
    return res.status(404).json(new ApiResponse(404, "Proposal not found"));
  }

  if (!proposal.sponsor.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized sponsor");
  }
  if (["pending", "approved", "rejected"].includes(proposal.status)) {
    throw new ApiError(400, "No counter-offer to respond to");
  }

  if (action == "accept") {
    proposal.counterStatus = "accepted";
    proposal.status = "approved";
  } else {
    proposal.counterStatus = "rejected";
    proposal.status = "rejected";
  }

  await proposal.save(
    { returnDocument: "after" },
    { validateBeforeSave: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Counter respond sent successfully", proposal));
});

//organizer only
const getOrganizerProposals = asyncHandler(async (req, res) => {
  const organizerEvents = await Event.find({ organizer: req.user?._id }).select(
    "_id",
  );
  const eventIds = organizerEvents.map((event) => event._id);

  if (eventIds.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No events found for this organizer", []));
  }

  const allProposals = await Proposal.find({
    event: { $in: eventIds },
  })
    .populate("sponsor", "firstName lastName email")
    .populate("event", "title eventDate eventType")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Proposals fetched successfully", allProposals));
});

const getEventProposals = asyncHandler(async (req, res) => {
  const { eventId } = req.params;

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (!event.organizer.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized to view these proposals");
  }

  const allProposals = await Proposal.find({ event: eventId }).populate(
    "sponsor",
    "fullName email",
  );

  if (allProposals.length === 0) {
    throw new ApiError(404, "No proposals found for this event");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Proposals fetched successfully", allProposals));
});

const orgDecisionOnProposal = asyncHandler(async (req, res) => {
  const { action } = req.params;

  const proposal = await Proposal.findById(req.params.proposalId);

  if (!proposal) {
    throw new ApiError(400, "No proposal found");
  }

  if (action === "approve") {
    proposal.status = "approved";
  } else if (action === "reject") {
    proposal.status = "rejected";
  } else {
    throw new ApiError(400, "Invalid action");
  }

  await proposal.save(
    { returnDocument: "after" },
    { validateBeforeSave: true },
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Organizer decision submitted successfully",
        proposal,
      ),
    );
});

const orgSendsCounter = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const { counterOffer, counterNote } = req.body;

  const proposal = await Proposal.findById(proposalId).populate(
    "event",
    "organizer",
  );

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  if (!proposal.event.organizer.equals(req.user._id)) {
    throw new ApiError(403, "Not authorized to send counter offer");
  }
  if (proposal.status === "negotiating") {
    throw new ApiError(
      400,
      "You have already sent counter. Proposal status is negotiating",
    );
  }

  if (["approved", "rejected"].includes(proposal.status)) {
    throw new ApiError(
      400,
      "Cannot send counter an approved or rejected proposal",
    );
  }

  proposal.status = "negotiating";
  proposal.counterOffer = counterOffer;
  proposal.counterNote = counterNote;
  proposal.counterStatus = "pending";
  await proposal.save(
    { returnDocument: "after" },
    { validateBeforeSave: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Counter offer submitted", proposal));
});

const orgUpdateCounter = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const { counterOffer, counterNote } = req.body;

  const proposal = await Proposal.findById(proposalId).populate(
    "event",
    "organizer",
  );

  if (!proposal) {
    throw new ApiError(404, "Proposal not found");
  }

  if (!proposal.event.organizer.equals(req.user._id)) {
    throw new ApiError(403, "Not authorized to send counter offer");
  }
  if (["accepted", "rejected"].includes(proposal.counterStatus)) {
    throw new ApiError(400, "Accepted or rejected counter cannot be update");
  }

  if (["approved", "rejected"].includes(proposal.status)) {
    throw new ApiError(400, "Cannot counter an approved or rejected proposal");
  }

  proposal.counterOffer = counterOffer;
  proposal.counterNote = counterNote;
  await proposal.save(
    { returnDocument: "after" },
    { validateBeforeSave: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Counter offer updated", proposal));
});

export {
  submitProposal,
  getEventProposals,
  getMyProposal,
  updateProposal,
  orgSendsCounter,
  orgUpdateCounter,
  orgDecisionOnProposal,
  sponsorRespondToCounter,
  getOrganizerProposals,
};
