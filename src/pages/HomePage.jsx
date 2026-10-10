import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, Search, Building2, Target, Cpu, BookOpen } from 'lucide-react';
import api from '../api/client';
import InternshipCard from '../components/InternshipCard';
import { useAuth } from '../context/AuthContext';

export const HomePage = ({ onNavigate, onSelectInternship, onAnalyzeInternship, onApplyInternship }) => {
  const { isAuthenticated, isStudent, demoLogin } = useAuth();
  const [featuredInternships, setFeaturedInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/internships');
        setFeaturedInternships(res.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured internships', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onNavigate('explore', { search: searchQuery });
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/20 via-cyan-500/20 to-purple-500/10 blur-[120px] pointer-events-none rounded-full"></div>

        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-semibold tracking-wide backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI Matching & Skill Gap Analysis</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Bridge the Gap Between Your <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Skills</span> and <span className="underline decoration-emerald-500/40 decoration-wavy">Dream Internships</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          SkillBridge analyzes your technical stack, calculates semantic role compatibility, highlights exact missing competencies, and maps personalized learning roadmaps to get you hired.
        </p>

        {/* Interactive Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          className="mt-8 max-w-2xl mx-auto p-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
        >
          <div className="flex-1 flex items-center gap-3 px-3 w-full">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role (e.g. Spring Boot, React, AI, Python)..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none py-2"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 shrink-0"
          >
            <span>Search Roles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo CTA for instant evaluation */}
        {!isAuthenticated && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span>Try instant demo:</span>
            <button
              onClick={() => demoLogin('student')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4"
            >
              Sign in as Student (Alex)
            </button>
            <span>•</span>
            <button
              onClick={() => demoLogin('recruiter')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4"
            >
              Sign in as Recruiter (Marcus)
            </button>
          </div>
        )}

        {/* Statistics Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">94.8%</div>
            <div className="text-xs text-slate-400 mt-1">Skill Match Accuracy</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">1,500+</div>
            <div className="text-xs text-slate-400 mt-1">Verified Internships</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">3-Week</div>
            <div className="text-xs text-slate-400 mt-1">Avg. Gap Closure Time</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">₹42,000</div>
            <div className="text-xs text-slate-400 mt-1">Average Monthly Stipend</div>
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">Top Opportunities</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Recommended Internship Openings</h2>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
          >
            <span>View All Internships</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                onApply={onApplyInternship}
                onViewDetail={onSelectInternship}
                onAnalyze={onAnalyzeInternship}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3-Step AI Workflow Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">How It Works</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Engineering-Grade Career Intelligence</h2>
          <p className="mt-3 text-sm text-slate-400">
            Eliminate rejection blackholes with transparent skill indexing and real-time gap remediation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-5 text-emerald-400 font-bold">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Build Your Skill Matrix</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Catalogue your programming languages, frameworks, and database proficiencies. Our engine parses your resume keywords to form your verified profile.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-5 text-cyan-400 font-bold">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Semantic Compatibility</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every internship posting is evaluated using weighted skill matching, seniority checks, and semantic text overlap, yielding an honest match percentage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 relative group hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-5 text-purple-400 font-bold">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Roadmap & Interview Prep</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Receive step-by-step 3-week study roadmaps for identified skill gaps alongside customized technical interview questions with model answers.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/30 p-8 sm:p-14 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to find your perfect technical internship?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Create your profile in 60 seconds, analyze skill match against top engineering squads, and apply with confidence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('advisor')}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              Try AI Skill Gap Advisor
            </button>
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-colors"
            >
              Browse All Openings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
