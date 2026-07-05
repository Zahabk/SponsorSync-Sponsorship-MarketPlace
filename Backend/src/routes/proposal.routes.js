import { Router } from "express";
import { authorizeRole, verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getEventProposals,
  getMyProposal,
  orgDecisionOnProposal,
  orgSendsCounter,
  orgUpdateCounter,
  sponsorRespondToCounter,
  submitProposal,
  updateProposal,
} from "../controllers/proposal.controllers.js";

const router = Router();


//sponsor only
router
  .route("/:eventId")
  .post(verifyJWT, authorizeRole("sponsor"), submitProposal);
router.route("/mine").get(verifyJWT, authorizeRole("sponsor"), getMyProposal);
router.route("/:id").patch(verifyJWT, authorizeRole("sponsor"), updateProposal);
router
  .route("/respond/:id/:action")
  .patch(verifyJWT, authorizeRole("sponsor"), sponsorRespondToCounter);

//organizer only

router
  .route("/:eventId")
  .get(verifyJWT, authorizeRole("organizer"), getEventProposals);
router
  .route("/counter/:id")
  .post(verifyJWT, authorizeRole("organizer"), orgSendsCounter);
router
  .route("/update-counter/:id")
  .patch(verifyJWT, authorizeRole("organizer"), orgUpdateCounter);
router
  .route("/:id/decision")
  .patch(verifyJWT, authorizeRole("organizer"), orgDecisionOnProposal);

export default router;

// Proposals
// POST  /api/proposals ----> Submit proposal(event,tier,proposedBudget,message)
// GET   /api/proposals/event/:eventId ----> Organizer Views Proposals for a specific event.
// GET   /api/proposals/mine  ---->Sponsor Views Their Own Proposals
// PATCH /api/proposals/:id/decision ----> approve/reject
// PATCH /api/proposals/:id/counter ---->  Organizer Sends Counter-Offer(amount,note)
// PATCH /api/proposals/:id/respond ---->   Sponsor Responds to Counter-Offer
