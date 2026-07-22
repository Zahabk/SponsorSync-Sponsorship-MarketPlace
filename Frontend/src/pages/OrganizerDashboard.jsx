import React, { useMemo } from "react";
import {
  MdOutlineEvent,
  MdOutlineDescription,
  MdOutlinePeople,
  MdOutlineAttachMoney,
  MdOutlineCalendarToday,
  MdInbox,
} from "react-icons/md";
import StatCards from "../components/OrganizerDashboard/StatCards";
import SectionHeader from "../components/OrganizerDashboard/SectionHeader";
import StatusBadge from "../components/OrganizerDashboard/StatusBadge";
import { useOrganizerDashboard } from "../context/OrganizerDashboardContext";

const tierConfig = {
  Gold: "text-amber-400 font-semibold",
  Silver: "text-slate-300 font-semibold",
  Bronze: "text-orange-500 font-semibold",
};

const OrganizerDashboard = () => {
  const { myEvents, proposals, loading } = useOrganizerDashboard();

  const stats = useMemo(() => {
    const activeCount = myEvents.filter((e) => e.status === "open").length;
    const pendingCount = proposals.filter((p) => p.status === "pending").length;
    const approvedProposals = proposals.filter((p) => p.status === "approved");
    const totalFunding = approvedProposals.reduce(
      (sum, p) =>
        sum +
        (p.counterOffer > 0 && p.counterStatus === "accepted"
          ? p.counterOffer
          : p.proposedBudget),
      0,
    );
    const totalSponsorsEngaged = [
      ...new Set(proposals.map((p) => p.sponsorName)),
    ].length;
    const negotiateCount = proposals.filter(
      (p) => p.status === "negotiating",
    ).length;

    return [
      {
        label: "Total Events",
        value: myEvents.length,
        sub: `${activeCount} active right now`,
        icon: <MdOutlineEvent size={18} />,
        iconBg: "bg-primary/30",
        iconColor: "text-primary",
      },
      {
        label: "Proposals",
        value: proposals.length,
        sub: `${pendingCount} awaiting review`,
        icon: <MdOutlineDescription size={18} />,
        iconBg: "bg-secondary/30",
        iconColor: "text-secondary",
      },
      {
        label: "Funding Secured",
        value: totalFunding,
        sub: `Across ${approvedProposals.length} approvals`,
        icon: <MdOutlineAttachMoney size={18} />,
        iconBg: "bg-accent/30",
        iconColor: "text-accent",
      },
      {
        label: "Sponsors Engaged",
        value: totalSponsorsEngaged,
        sub: `${negotiateCount} in negotiation`,
        icon: <MdOutlinePeople size={18} />,
        iconBg: "bg-info/30",
        iconColor: "text-info",
      },
    ];
  }, [myEvents, proposals]);

  const recentProposals = useMemo(() => proposals.slice(0, 5), [proposals]);

  const proposalBreakdown = useMemo(
    () => [
      {
        label: "Approved",
        value: proposals.filter((p) => p.status === "approved").length,
        color: "bg-success",
        progress: "progress-success",
      },
      {
        label: "Negotiating",
        value: proposals.filter((p) => p.status === "negotiating").length,
        color: "bg-info",
        progress: "progress-info",
      },
      {
        label: "Pending",
        value: proposals.filter((p) => p.status === "pending").length,
        color: "bg-warning",
        progress: "progress-warning",
      },
      {
        label: "Rejected",
        value: proposals.filter((p) => p.status === "rejected").length,
        color: "bg-error",
        progress: "progress-error",
      },
    ],
    [proposals],
  );

  const total = proposalBreakdown.reduce((s, i) => s + i.value, 0);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return myEvents
      .filter((e) => new Date(e.eventDate) >= today)
      .sort(
        (a, b) =>
          new Date(a.eventDate) - new Date(b.eventDate) ||
          a.title.localeCompare(b.title),
      )
      .slice(0, 3);
  }, [myEvents]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-base-content">
          Overview
        </h1>
        <p className="text-sm text-base-content/50 mt-0.5">
          Here's what's happening across your events.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <StatCards key={s.label} {...s} />
        ))}
      </div>

      {/* Recent proposals */}
      <div>
        <SectionHeader title="Recent proposals" to="/dashboard/proposals" />
        <div className="bg-base-200 rounded-xl overflow-hidden">
          {recentProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-base-content/40">
              <MdInbox size={36} className="mb-2 opacity-60" />
              <p className="text-sm font-medium">No proposals received yet</p>
              <p className="text-xs max-w-xs mt-0.5">
                When sponsors apply to your active events, they will show up
                right here.
              </p>
            </div>
          ) : (
            <>
              {/* Table — md and above */}
              <div className="hidden md:block overflow-x-auto">
                <table className="table table-sm w-full">
                  <thead>
                    <tr className="border-b border-base-300/50 text-base-content/40 text-xs uppercase tracking-wide">
                      <th className="bg-base-200 font-medium py-3">Event</th>
                      <th className="bg-base-200 font-medium py-3">Sponsor</th>
                      <th className="bg-base-200 font-medium py-3">Tier</th>
                      <th className="bg-base-200 font-medium py-3">Budget</th>
                      <th className="bg-base-200 font-medium py-3">Counter</th>
                      <th className="bg-base-200 font-medium py-3">Status</th>
                      <th className="bg-base-200 font-medium py-3 text-right">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProposals.map((p) => (
                      <tr
                        key={p._id}
                        className="border-b border-base-300/30 hover:bg-base-300/20 transition-colors last:border-0"
                      >
                        <td className="py-3 font-medium text-sm text-base-content max-w-[140px] truncate">
                          {p.event?.title}
                        </td>
                        <td className="py-3 text-sm text-base-content/60 max-w-[120px] truncate">
                          {p.sponsor?.name || "—"}
                        </td>
                        <td className={`py-3 text-sm ${tierConfig[p.tier]}`}>
                          {p.tier}
                        </td>
                        <td className="py-3 text-sm text-base-content font-mono">
                          ${p.proposedBudget?.toLocaleString()}
                        </td>
                        <td className="py-3 text-sm text-base-content font-mono">
                          {p.counterOffer
                            ? `$${p.counterOffer.toLocaleString()}`
                            : "—"}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="py-3 text-xs text-base-content/40 text-right">
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards — mobile only */}
              <div className="md:hidden divide-y divide-base-300/30">
                {recentProposals.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-start justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-base-content truncate">
                        {p.event?.title}
                      </p>
                      <p className="text-xs text-base-content/50 mt-0.5">
                        {p.sponsor?.name || "—"}&nbsp;·&nbsp;
                        <span className={tierConfig[p.tier]}>{p.tier}</span>
                      </p>
                      <div className="mt-1.5">
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-base-content font-mono">
                        ${p.proposedBudget?.toLocaleString()}
                      </p>
                      {p.counterOffer > 0 && (
                        <p className="text-xs text-secondary font-mono">
                          ↔ ${p.counterOffer.toLocaleString()}
                        </p>
                      )}
                      <p className="text-[10px] text-base-content/40 mt-0.5">
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upcoming events + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Upcoming events */}
        <div>
          <SectionHeader
            title="Upcoming events"
            to="/dashboard/events"
            linkLabel="All events"
          />
          <div className="bg-base-200 rounded-xl divide-y divide-base-300/60">
            {upcomingEvents.length === 0 ? (
              <div className="p-6 text-center text-sm text-base-content/40">
                No upcoming events scheduled
              </div>
            ) : (
              upcomingEvents.map((e) => (
                <div
                  key={e._id}
                  className="flex items-center justify-between px-4 sm:px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-base-content truncate">
                      {e.title}
                    </p>
                    <p className="text-xs text-base-content/40 mt-0.5 flex items-center gap-1">
                      <MdOutlineCalendarToday size={11} />
                      <span className="truncate">
                        {new Date(e.eventDate).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        &nbsp;·&nbsp;{e.location}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Proposal breakdown */}
        <div>
          <SectionHeader title="Proposal breakdown" />
          <div className="bg-base-200 rounded-xl p-4 sm:p-5 space-y-3">
            {proposalBreakdown.map(({ label, value, color, progress }) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${color}`}
                      />
                      <span className="text-xs text-base-content/60">
                        {label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
                      <span className="text-base-content/40">{pct}%</span>
                      <span className="text-base-content w-4 text-right">
                        {value}
                      </span>
                    </div>
                  </div>
                  <progress
                    className={`progress ${progress} w-full h-1.5`}
                    value={value}
                    max={total}
                  />
                </div>
              );
            })}
            <p className="text-xs text-base-content/30 pt-2 border-t border-base-300/30">
              Total {total} proposals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
