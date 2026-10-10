import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, RefreshCw, Sparkles, Building2, MapPin } from 'lucide-react';
import api from '../api/client';
import InternshipCard from '../components/InternshipCard';
import { useAuth } from '../context/AuthContext';

export const ExplorePage = ({ initialSearch = '', onSelectInternship, onAnalyzeInternship, onApplyInternship }) => {
  const { isAuthenticated, isStudent } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState('All');
  const [workMode, setWorkMode] = useState('ALL');
  const [minStipend, setMinStipend] = useState(0);
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [sortBy, setSortBy] = useState('match'); // 'match', 'stipend', 'newest'

  const categories = ['All', 'Software Engineering', 'AI & Data Science', 'Cloud & DevOps'];

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (workMode !== 'ALL') params.workMode = workMode;

      const res = await api.get('/internships', { params });
      setInternships(res.data);
    } catch (err) {
      console.error('Failed to load internships', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [category, workMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  // Client-side filtering & sorting
  const filteredInternships = internships
    .filter((item) => {
      if (minStipend > 0 && item.stipendMonthly < minStipend) return false;
      if (minMatchScore > 0 && (item.userMatchScore || 0) < minMatchScore) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'match') {
        return (b.userMatchScore || 0) - (a.userMatchScore || 0);
      } else if (sortBy === 'stipend') {
        return (b.stipendMonthly || 0) - (a.stipendMonthly || 0);
      } else {
        return b.id - a.id;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore AI-Matched Internships</h1>
        <p className="text-sm text-slate-400 mt-1">
          {isAuthenticated && isStudent 
            ? 'Roles are dynamically ranked according to your verified profile skills and resume semantic match.'
            : 'Browse tech internship listings with live skill requirements and AI match intelligence.'}
        </p>
      </div>

      {/* Main Search & Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 mb-8 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, required skills, or company name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('All');
                setWorkMode('ALL');
                setMinStipend(0);
                setMinMatchScore(0);
                fetchInternships();
              }}
              title="Reset Filters"
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-slate-700"
            >
              <option value="match">Best AI Match</option>
              <option value="stipend">Highest Stipend</option>
              <option value="newest">Recently Posted</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters: Work mode, Stipend, Match score */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Work Mode</label>
            <div className="flex items-center gap-2">
              {['ALL', 'REMOTE', 'HYBRID', 'ON_SITE'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setWorkMode(mode)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                    workMode === mode
                      ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {mode === 'ALL' ? 'Any' : mode.replace('_', '-')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 font-semibold mb-1">
              <span>Min. Stipend:</span>
              <span className="text-emerald-400">{minStipend > 0 ? `₹${minStipend.toLocaleString()}+` : 'Any'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="5000"
              value={minStipend}
              onChange={(e) => setMinStipend(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 font-semibold mb-1">
              <span>Min. Match Score:</span>
              <span className="text-cyan-400">{minMatchScore > 0 ? `${minMatchScore}%+` : 'Any'}</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="10"
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{filteredInternships.length}</span> verified internship opportunities
        </p>
      </div>

      {/* Grid of Internships */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-72 rounded-2xl bg-slate-900/50 animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : filteredInternships.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No internships matched your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search query, lowering the minimum match score, or resetting the filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setWorkMode('ALL');
              setMinStipend(0);
              setMinMatchScore(0);
              fetchInternships();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInternships.map((internship) => (
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
    </div>
  );
};

export default ExplorePage;
