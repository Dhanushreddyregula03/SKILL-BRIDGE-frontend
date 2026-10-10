import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';

export const MatchScoreBadge = ({ score, size = 'md', showLabel = true }) => {
  if (score === null || score === undefined) return null;

  let colorClass = 'text-slate-400 bg-slate-800/80 border-slate-700';
  let badgeText = 'Basic Match';
  let Icon = Sparkles;

  if (score >= 85) {
    colorClass = 'text-emerald-400 bg-emerald-950/70 border-emerald-500/40 shadow-sm shadow-emerald-500/20';
    badgeText = 'Top Match';
    Icon = Flame;
  } else if (score >= 70) {
    colorClass = 'text-cyan-400 bg-cyan-950/70 border-cyan-500/40 shadow-sm shadow-cyan-500/20';
    badgeText = 'Strong Match';
    Icon = CheckCircle2;
  } else if (score >= 50) {
    colorClass = 'text-amber-400 bg-amber-950/70 border-amber-500/40';
    badgeText = 'Moderate';
    Icon = AlertTriangle;
  } else {
    colorClass = 'text-rose-400 bg-rose-950/60 border-rose-500/30';
    badgeText = 'Skill Gap';
    Icon = Sparkles;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs md:text-sm px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <div className={`inline-flex items-center rounded-full border backdrop-blur-md transition-all ${colorClass} ${sizeClasses[size]}`}>
      <Icon className={size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{Math.round(score)}% Match</span>
      {showLabel && size !== 'sm' && (
        <span className="opacity-80 text-[11px] font-normal border-l border-current/30 pl-1.5 ml-0.5">
          {badgeText}
        </span>
      )}
    </div>
  );
};

export default MatchScoreBadge;
