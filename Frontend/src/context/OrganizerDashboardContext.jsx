import React, { createContext, useContext, useState, useEffect } from "react";
import EventService from "../services/event";
import ProposalService from "../services/proposal";

const OrganizerDashboardContext = createContext();

export const OrganizerDashboardProvider = ({ children }) => {
  const [myEvents, setMyEvents] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [eventsRes, proposalsRes] = await Promise.all([
        EventService.getOrganizerEvents(),
        ProposalService.getProposalsForOrganizerEvents(),
      ]);
      setMyEvents(eventsRes.data);
      setProposals(proposalsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard context data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <OrganizerDashboardContext.Provider
      value={{
        myEvents,
        setMyEvents,
        proposals,
        setProposals,
        loading
      }}
    >
      {children}
    </OrganizerDashboardContext.Provider>
  );
};

export const useOrganizerDashboard = () => {
  return useContext(OrganizerDashboardContext);
};
