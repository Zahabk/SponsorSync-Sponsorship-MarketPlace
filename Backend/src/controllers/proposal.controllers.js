import { Proposal } from "../models/proposal.model.js";
import { Event } from "../models/event.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const submitProposal = asyncHandler(async (req, res) => {
  const sponsorId = req.user._id;
  const { eventId, proposedBudget, tier, message } = req.body;

  if (!eventId || !proposedBudget || !tier) {
    throw new ApiError(400, "Event ID, proposed budget, and tier are required");
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

const orgGetProposal = asyncHandler(async (req, res) => {
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

const sponsorGetProposal = asyncHandler(async (req, res) => {
  const allProposals = await Proposal.find({ sponsor: req.user._id });

  if (allProposals.length === 0) {
    throw new ApiError(404, "No proposals found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Proposals fetched successfully", allProposals));
});

const orgDecisionOnProposal = asyncHandler(async (req, res) => {
  const { action } = req.body;

  const proposal = await Proposal.findById(req.params.id);

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

  await proposal.save({ validateBeforeSave: true });

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
  const { id } = req.params;
  const { counterOffer, counterNote } = req.body;

  const proposal = await Proposal.findById(id).populate("event", "organizer");

  if (!proposal) {
    return res.status(404).json(new ApiResponse(404, "Proposal not found"));
  }

  if (!proposal.event.organizer.equals(req.user._id)) {
    return res.status(403).json(new ApiResponse(403, "Not authorized"));
  }

  if (!["pending", "negotiating"].includes(proposal.status)) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "Cannot counter an approved or rejected proposal"),
      );
  }

  proposal.status = "negotiating";
  proposal.counterOffer = counterOffer;
  proposal.counterNote = counterNote;
  proposal.counterStatus = "pending";
  await proposal.save({ validateBeforeSave: true });

  return res
    .status(200)
    .json(new ApiResponse(200, "Counter offer submitted", proposal));
});

const sponsorRespondOnCounter = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  const proposal = await Proposal.findById(id);
  if (!proposal) {
    return res.status(404).json(new ApiResponse(404, "Proposal not found"));
  }

  if (!proposal.sponsor.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorized sponsor");
  }
  if (proposal.status !== "negotiating") {
    throw new ApiError(400, "No counter-offer to respond to");
  }

  if (action == "accept") {
    proposal.counterStatus = "accepted";
    proposal.status = "approved";
  } else {
    proposal.counterStatus = "rejected";
    proposal.status = "rejected";
  }

  await proposal.save({ validateBeforeSave: true });

  return res.status(200).json(new ApiResponse(200, "Successful", proposal));
});

export {
  submitProposal,
  orgGetProposal,
  sponsorGetProposal,
  orgSendsCounter,
  orgDecisionOnProposal,
  sponsorRespondOnCounter,
};
