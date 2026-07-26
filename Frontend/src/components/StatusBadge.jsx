import React from 'react'
import { MdOutlineAccessTime,MdOutlineSync,MdOutlineCheckCircle,MdOutlineCancel } from "react-icons/md";


const statusConfig = {
  pending: {
    label: "Pending",
    classes: "bg-amber-900/40 text-amber-400 border border-amber-700/30",
    icon: <MdOutlineAccessTime size={12} />,
  },
  negotiating: {
    classes: "bg-sky-900/40 text-sky-400 border border-sky-700/30",
    label: "Negotiating",
    icon: <MdOutlineSync size={12} />,
  },
  approved: {
    label: "Approved",
    classes: "bg-emerald-900/40 text-emerald-400 border border-emerald-700/30",
    icon: <MdOutlineCheckCircle size={12} />,
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-900/40 text-red-400 border border-red-700/30",
    icon: <MdOutlineCancel size={12} />,
  },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] ?? statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${cfg.classes}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};
export default StatusBadge
