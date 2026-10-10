import React from 'react';

export const SkillTag = ({ name, level, isMandatory, isMissing, onClick }) => {
  const getLevelColor = (lvl) => {
    switch (lvl) {
      case 'EXPERT':
        return 'border-purple-500/30 text-purple-300 bg-purple-950/40';
      case 'ADVANCED':
        return 'border-emerald-500/30 text-emerald-300 bg-emerald-950/40';
      case 'INTERMEDIATE':
        return 'border-sky-500/30 text-sky-300 bg-sky-950/40';
      case 'BEGINNER':
      default:
        return 'border-slate-700 text-slate-300 bg-slate-800/60';
    }
  };

  if (isMissing) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border border-rose-500/30 bg-rose-950/30 text-rose-300">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
        {name}
        {isMandatory && <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">(Required)</span>}
      </span>
    );
  }

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getLevelColor(
        level
      )} ${onClick ? 'cursor-pointer hover:border-slate-500 transition-colors' : ''}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {name}
      {level && <span className="opacity-75 text-[10px] lowercase font-normal">({level.toLowerCase()})</span>}
      {isMandatory && <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">*</span>}
    </span>
  );
};

export default SkillTag;
