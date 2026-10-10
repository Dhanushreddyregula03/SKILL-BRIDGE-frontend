import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, MapPin, Banknote, Clock, Users, Calendar, Sparkles, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../api/client';
import MatchScoreBadge from '../components/MatchScoreBadge';
import SkillTag from '../components/SkillTag';
import { useAuth } from '../context/AuthContext';

export const InternshipDetailPage = ({ internshipId, onBack, onApply, onAnalyze }) => {
  const { isAuthenticated, isStudent } = useAuth();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/internships/${internshipId}`);
        setInternship(res.data);
      } catch (err) {
        setError('Failed to load internship details.');
      } finally {
        setLoading(false);
      }
    };
    if (internshipId) {
      fetchDetail();
    }
  }, [internshipId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-800 rounded"></div>
        <div className="h-48 bg-slate-900 rounded-2xl border border-slate-800"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 bg-slate-900 rounded-2xl border border-slate-800"></div>
          <div className="h-96 bg-slate-900 rounded-2xl border border-slate-800"></div>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-400 text-sm mb-4">{error || 'Internship not found.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Internships</span>
      </button>

      {/* Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/60 p-2 flex items-center justify-center shrink-0">
              {internship.companyLogo ? (
                <img src={internship.companyLogo} alt={internship.companyName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Building2 className="w-8 h-8 text-emerald-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{internship.category}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">{internship.workMode}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{internship.title}</h1>
              <p className="text-sm font-medium text-slate-300 mt-1">{internship.companyName}</p>
            </div>
          </div>

          {internship.userMatchScore !== undefined && (
            <div className="shrink-0 flex flex-col items-start sm:items-end">
              <span className="text-xs text-slate-400 mb-1">AI Match Compatibility</span>
              <MatchScoreBadge score={internship.userMatchScore} size="lg" />
            </div>
          )}
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
          <div className="flex items-center gap-2.5">
            <Banknote className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[11px]">Monthly Stipend</div>
              <div className="font-semibold text-white">
                {internship.stipendMonthly > 0 ? `₹${internship.stipendMonthly.toLocaleString()}/mo` : 'Unpaid'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[11px]">Location</div>
              <div className="font-semibold text-white">{internship.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[11px]">Duration</div>
              <div className="font-semibold text-white">{internship.duration}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-slate-500 text-[11px]">Openings & Applicants</div>
              <div className="font-semibold text-white">{internship.openings} Openings ({internship.applicantCount || 0} applied)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About role */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white">About the Internship</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {internship.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {internship.responsibilities && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white">Key Responsibilities</h2>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                {internship.responsibilities}
              </div>
            </div>
          )}

          {/* Required Skills & Proficiency */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white">Required Technical Skills</h2>
            <p className="text-xs text-slate-400">
              Each skill is evaluated by the AI Matching Engine. Mandatory skills are flagged with an asterisk (*).
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {internship.requiredSkills && internship.requiredSkills.map((s, idx) => (
                <SkillTag
                  key={idx}
                  name={s.skillName}
                  level={s.minimumLevel}
                  isMandatory={s.isMandatory}
                />
              ))}
            </div>
          </div>

          {/* Perks */}
          {internship.perks && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h2 className="text-lg font-bold text-white">Perks & Benefits</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {internship.perks}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: AI Matcher & CTA */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>AI Fit Evaluation</span>
            </div>

            {internship.userMatchScore !== undefined ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 mb-1">Your Semantic Profile Match</div>
                  <MatchScoreBadge score={internship.userMatchScore} size="lg" />
                  <p className="text-xs text-slate-300 mt-2">
                    {internship.userMatchScore >= 80 
                      ? 'You have exceptional technical alignment for this position!' 
                      : 'You have good foundational knowledge. Follow the AI roadmap to bridge remaining gaps.'}
                  </p>
                </div>

                <button
                  onClick={() => onAnalyze(internship)}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  View 3-Week Roadmap & Prep
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                Log in as a student to see your real-time compatibility score and missing skill breakdown for this opening.
              </div>
            )}

            {/* Apply button */}
            <button
              onClick={() => onApply(internship)}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              Apply for this Internship
            </button>

            <div className="pt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Direct application sent to verified recruiter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPage;
