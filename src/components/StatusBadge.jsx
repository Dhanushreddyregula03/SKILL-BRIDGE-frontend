import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStatusConfig = (st) => {
    switch (st) {
      case 'OFFERED':
        return {
          label: 'Offer Extended',
          classes: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/20',
          dot: 'bg-emerald-400',
        };
      case 'INTERVIEW_SCHEDULED':
        return {
          label: 'Interview Scheduled',
          classes: 'bg-purple-950/80 text-purple-300 border-purple-500/40 ring-1 ring-purple-500/20',
          dot: 'bg-purple-400 animate-pulse',
        };
      case 'SHORTLISTED':
        return {
          label: 'Shortlisted',
          classes: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 ring-1 ring-cyan-500/20',
          dot: 'bg-cyan-400',
        };
      case 'UNDER_REVIEW':
        return {
          label: 'Under Review',
          classes: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400',
        };
      case 'REJECTED':
        return {
          label: 'Not Selected',
          classes: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
        };
      case 'APPLIED':
      default:
        return {
          label: 'Application Received',
          classes: 'bg-slate-800/80 text-slate-300 border-slate-700',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${config.classes}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
