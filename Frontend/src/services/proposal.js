import Api from "./api.js";

const ProposalService = {
  //For sponsor
  submitProposal: async (eventId, proposalDetails) => {
    const res = await Api.post(`/proposals/${eventId}`, proposalDetails);
    return res;
  },
  getMyProposal: async () => {
    const res = await Api.get(`/proposals/mine`);
    return res;
  },

  updateProposal: async (proposalId, updatedDetails) => {
    const res = await Api.patch(`/proposals/${proposalId}`, updatedDetails);
    return res;
  },
  respondToCounter: async (proposalId, action) => {
    const res = await Api.patch(`/proposals/respond/${proposalId}/${action}`);
    return res;
  },

  //For organizer
  getEventProposals: async (eventId) => {
    const res = await Api.get(`/proposals/${eventId}`);
    return res;
  },
  organizerSendCounter: async (proposalId, counterDetails) => {
    const res = await Api.post(
      `/proposals/counter/${proposalId}`,
      counterDetails,
    );
    return res;
  },
  updateCounter: async (proposalId, counterDetails) => {
    const res = await Api.patch(
      `/proposals//update-counter/${proposalId}`,
      counterDetails,
    );
    return res;
  },
  decisionOnProposal: async (proposalId, action) => {
    const res = await Api.patch(`/proposals/decision/${proposalId}/${action}`);
    return res;
  },
};

export default ProposalService;
