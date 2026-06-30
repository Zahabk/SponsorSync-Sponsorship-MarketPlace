import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  orgDecisionOnProposal,
  orgGetProposal,
  orgSendsCounter,
  sponsorGetProposal,
  sponsorRespondOnCounter,
  submitProposal,
} from "../controllers/proposal.controllers.js";

const router = Router();

router.route("/").post(verifyJWT, submitProposal);
router.route("/event/:eventId").get(verifyJWT, orgGetProposal);
router.route("/mine").get(verifyJWT, sponsorGetProposal);
router.route("/:id/decision").patch(verifyJWT, orgDecisionOnProposal);
router.route("/:id/counter").patch(verifyJWT, orgSendsCounter);
router.route("/:id/respond").patch(verifyJWT, sponsorRespondOnCounter);

export default router;


// Proposals
// POST  /api/proposals ----> Submit proposal(event,tier,proposedBudget,message)
// GET   /api/proposals/event/:eventId ----> Organizer Views Proposals for a specific event.
// GET   /api/proposals/mine  ---->Sponsor Views Their Own Proposals
// PATCH /api/proposals/:id/decision ----> approve/reject
// PATCH /api/proposals/:id/counter ---->  Organizer Sends Counter-Offer(amount,note)
// PATCH /api/proposals/:id/respond ---->   Sponsor Responds to Counter-Offer
