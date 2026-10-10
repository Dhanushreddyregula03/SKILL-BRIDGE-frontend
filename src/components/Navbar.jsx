import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Briefcase, Compass, User, LogOut, ChevronDown, Rocket, Layers } from 'lucide-react';

export const Navbar = ({ currentTab, onNavigate }) => {
  const { user, isAuthenticated, isStudent, isRecruiter, logout, demoLogin } = useAuth();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleDemo = async (type) => {
    setShowDemoMenu(false);
    try {
      await demoLogin(type);
      if (type === 'recruiter') {
        onNavigate('recruiter-dashboard');
      } else {
        onNavigate('student-dashboard');
      }
    } catch (err) {
      console.error('Demo login failed', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">SkillBridge</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">AI</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">Intelligent Internship Matching</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onNavigate('explore')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              currentTab === 'explore'
                ? 'bg-slate-800/80 text-emerald-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            Explore Internships
          </button>

          <button
            onClick={() => onNavigate('advisor')}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              currentTab === 'advisor'
                ? 'bg-slate-800/80 text-cyan-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            AI Skill Gap Advisor
          </button>

          {isAuthenticated && (
            <button
              onClick={() => onNavigate(isRecruiter ? 'recruiter-dashboard' : 'student-dashboard')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                currentTab.includes('dashboard')
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              {isRecruiter ? 'Recruiter Hub' : 'My Dashboard'}
            </button>
          )}
        </nav>

        {/* Right CTA / User State */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Demo selector button */}
              <div className="relative">
                <button
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/70 hover:bg-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <Rocket className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo Logins</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showDemoMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold px-2 py-1 mb-1">
                      One-Click Demo Profiles
                    </p>
                    <button
                      onClick={() => handleDemo('student')}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 text-xs transition-colors flex flex-col gap-0.5"
                    >
                      <span className="font-semibold text-emerald-400">Alex Morgan (Student)</span>
                      <span className="text-[11px] text-slate-400">React, Java, Spring Boot, Docker</span>
                    </button>
                    <button
                      onClick={() => handleDemo('recruiter')}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-800/80 text-xs transition-colors flex flex-col gap-0.5 mt-1 border-t border-slate-800/60 pt-1.5"
                    >
                      <span className="font-semibold text-cyan-400">Marcus Vance (Recruiter)</span>
                      <span className="text-[11px] text-slate-400">Nexus Technologies (Employer)</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigate('login')}
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                Sign In
              </button>

              <button
                onClick={() => onNavigate('register')}
                className="text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div 
                onClick={() => onNavigate(isRecruiter ? 'recruiter-dashboard' : 'student-dashboard')}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xs">
                  {user.fullName ? user.fullName.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">{user.fullName}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    {isRecruiter ? 'Recruiter' : 'Student'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  onNavigate('home');
                }}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-transparent hover:border-rose-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
