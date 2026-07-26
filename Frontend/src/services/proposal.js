import Api from "./api.js";

const ProposalService = {
  //For sponsor
  submitProposal: async (eventId, proposalDetails) => {
    const res = await Api.post(`/proposals/${eventId}`, proposalDetails);
    return res.data;
  },
  getMyProposal: async () => {
    const res = await Api.get(`/proposals/mine`);
    return res.data;
  },

  updateProposal: async (proposalId, updatedDetails) => {
    const res = await Api.patch(`/proposals/${proposalId}`, updatedDetails);
    return res.data;
  },
  respondToCounter: async (proposalId, action) => {
    const res = await Api.patch(`/proposals/respond/${proposalId}/${action}`);
    return res.data;
  },

  //For organizer
  getProposalsForOrganizerEvents: async () => {
    const res = await Api.get(`/proposals`);
    return res.data;
  },
  getEventProposals: async (eventId) => {
    const res = await Api.get(`/proposals/${eventId}`);
    return res.data;
  },
  organizerSendCounter: async (proposalId, counterDetails) => {
    const res = await Api.post(
      `/proposals/counter/${proposalId}`,
      counterDetails,
    );
    return res.data;
  },
  updateCounter: async (proposalId, counterDetails) => {
    const res = await Api.patch(
      `/proposals/update-counter/${proposalId}`,
      counterDetails,
    );
    return res.data;
  },
  decisionOnProposal: async (proposalId, action) => {
    const res = await Api.patch(`/proposals/decision/${proposalId}/${action}`);
    return res.data;
  },
};

export default ProposalService;
