import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import EventService from "../services/event";
import ProposalService from "../services/proposal";

const OrganizerDashboardContext = createContext();

export const OrganizerDashboardProvider = ({ children }) => {
  const [myEvents, setMyEvents] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
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
      if (showLoader) setLoading(false);
    }
  }, []);

  const updateProposal = useCallback((proposalId, updates) => {
    setProposals((prev) =>
      prev.map((p) => (p._id === proposalId ? { ...p, ...updates } : p)),
    );
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        fetchDashboardData(false);
      }
    };
    const onFocus = () => fetchDashboardData(false);

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchDashboardData]);

  return (
    <OrganizerDashboardContext.Provider
      value={{
        myEvents,
        setMyEvents,
        proposals,
        setProposals,
        updateProposal,
        refreshEvents: fetchDashboardData,
        loading,
      }}
    >
      {children}
    </OrganizerDashboardContext.Provider>
  );
};

export const useOrganizerDashboard = () => {
  return useContext(OrganizerDashboardContext);
};