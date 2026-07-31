import { Router } from "express";
import { authorizeRole, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getEventProposals,
  getMyProposal,
  getOrganizerProposals,
  orgDecisionOnProposal,
  orgSendsCounter,
  orgUpdateCounter,
  sponsorRespondToCounter,
  submitPayment,
  submitProposal,
  updateProposal,
} from "../controllers/proposal.controllers.js";

const router = Router();

//organizer only
router
  .route("/")
  .get(verifyJWT, authorizeRole("organizer"), getOrganizerProposals);

//sponsor only
router
  .route("/:eventId")
  .post(verifyJWT, authorizeRole("sponsor"), submitProposal);
router.route("/mine").get(verifyJWT, authorizeRole("sponsor"), getMyProposal);
router
  .route("/:proposalId")
  .patch(verifyJWT, authorizeRole("sponsor"), updateProposal);
router
  .route("/respond/:proposalId/:action")
  .patch(verifyJWT, authorizeRole("sponsor"), sponsorRespondToCounter);
router
  .route("/:proposalId/payment")
  .patch(verifyJWT, authorizeRole("sponsor"), submitPayment);

//organizer only
router
  .route("/:eventId")
  .get(verifyJWT, authorizeRole("organizer"), getEventProposals);
router
  .route("/counter/:proposalId")
  .post(verifyJWT, authorizeRole("organizer"), orgSendsCounter);
router
  .route("/update-counter/:proposalId")
  .patch(verifyJWT, authorizeRole("organizer"), orgUpdateCounter);
router
  .route("/decision/:proposalId/:action")
  .patch(verifyJWT, authorizeRole("organizer"), orgDecisionOnProposal);

export default router;

// Proposals
// POST  /api/proposals ----> Submit proposal(event,tier,proposedBudget,message)
// GET   /api/proposals/event/:eventId ----> Organizer Views Proposals for a specific event.
// GET   /api/proposals/mine  ---->Sponsor Views Their Own Proposals
// PATCH /api/proposals/:id/decision ----> approve/reject
// PATCH /api/proposals/:id/counter ---->  Organizer Sends Counter-Offer(amount,note)
// PATCH /api/proposals/:id/respond ---->   Sponsor Responds to Counter-Offer
