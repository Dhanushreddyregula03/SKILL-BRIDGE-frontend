import React from 'react';
import { Building2, MapPin, Clock, Banknote, Users, Sparkles, ArrowRight } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';
import SkillTag from './SkillTag';

export const InternshipCard = ({ internship, onApply, onViewDetail, onAnalyze }) => {
  const formatCurrency = (val) => {
    if (!val || val === 0) return 'Unpaid / Stipend on Performance';
    return `₹${val.toLocaleString()} / mo`;
  };

  return (
    <div className="group relative rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 flex flex-col justify-between">
      
      {/* Top row: Company & Role */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 p-1 flex items-center justify-center shrink-0">
              {internship.companyLogo ? (
                <img 
                  src={internship.companyLogo} 
                  alt={internship.companyName} 
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-emerald-400" />
              )}
            </div>
            <div>
              <h3 
                onClick={() => onViewDetail && onViewDetail(internship)}
                className="text-base font-bold text-white group-hover:text-emerald-400 cursor-pointer transition-colors leading-snug"
              >
                {internship.title}
              </h3>
              <p className="text-xs font-medium text-slate-400 mt-0.5">{internship.companyName}</p>
            </div>
          </div>

          {internship.userMatchScore !== undefined && (
            <MatchScoreBadge score={internship.userMatchScore} size="sm" />
          )}
        </div>

        {/* Badges / Meta row */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-slate-400">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
            <MapPin className="w-3 h-3 text-slate-400" />
            {internship.location} ({internship.workMode})
          </span>

          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
            <Banknote className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">{formatCurrency(internship.stipendMonthly)}</span>
          </span>

          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/50">
            <Clock className="w-3 h-3 text-cyan-400" />
            {internship.duration}
          </span>
        </div>

        {/* Short description preview */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {internship.description}
        </p>

        {/* Required skills */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Target Stack & Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {internship.requiredSkills && internship.requiredSkills.slice(0, 4).map((skill, idx) => (
              <SkillTag 
                key={idx} 
                name={skill.skillName} 
                level={skill.minimumLevel} 
                isMandatory={skill.isMandatory}
              />
            ))}
            {internship.requiredSkills && internship.requiredSkills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                +{internship.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Row */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onAnalyze && onAnalyze(internship)}
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Gap Analysis
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetail && onViewDetail(internship)}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800/40 text-xs font-medium text-slate-200 hover:text-white transition-colors"
          >
            Details
          </button>
          <button
            onClick={() => onApply && onApply(internship)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] flex items-center gap-1"
          >
            Apply
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;
