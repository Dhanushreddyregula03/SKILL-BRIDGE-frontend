import React from 'react';
import { Sparkles, Heart, Shield, Cpu, Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">SkillBridge</span>
            <p className="text-xs text-slate-400">AI-Powered Skill & Internship Matching Platform</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 hover:text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Spring Boot 3 + Java 21 Backend
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-300">
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            React + Vite + Tailwind Frontend
          </span>
          <span className="flex items-center gap-1.5 hover:text-slate-300">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            Stateless JWT Security & In-Memory H2
          </span>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for engineering students & top recruiters</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
