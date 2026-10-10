import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, CheckCircle2, AlertTriangle, BookOpen, HelpCircle, Layers, ArrowRight, Lightbulb, Compass } from 'lucide-react';
import api from '../api/client';
import MatchScoreBadge from '../components/MatchScoreBadge';
import SkillTag from '../components/SkillTag';
import { useAuth } from '../context/AuthContext';

export const AiSkillAdvisorPage = ({ preselectedInternship, onApplyInternship }) => {
  const { isAuthenticated, isStudent } = useAuth();
  const [internships, setInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState(preselectedInternship?.id || '');
  
  // Custom Playground state
  const [mode, setMode] = useState(preselectedInternship ? 'internship' : (isAuthenticated && isStudent ? 'internship' : 'playground'));
  const [customRole, setCustomRole] = useState('Full-Stack Java & Cloud Intern');
  const [customRequiredSkills, setCustomRequiredSkills] = useState('Java, Spring Boot, React, Docker, PostgreSQL, REST API');
  const [customUserSkills, setCustomUserSkills] = useState('Java, React, JavaScript, HTML, Git, SQL');
  const [customResumeText, setCustomResumeText] = useState('CS student with experience building full-stack applications with React frontend and Java REST endpoints.');

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('breakdown'); // 'breakdown', 'roadmap', 'interview'

  // Fetch available internships for selector
  useEffect(() => {
    const loadList = async () => {
      try {
        const res = await api.get('/internships');
        setInternships(res.data);
        if (!selectedInternshipId && res.data.length > 0) {
          setSelectedInternshipId(res.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load internships for advisor', err);
      }
    };
    loadList();
  }, []);

  // When selected internship or mode changes, run analysis
  useEffect(() => {
    if (mode === 'internship' && selectedInternshipId) {
      runInternshipAnalysis(selectedInternshipId);
    } else if (mode === 'playground') {
      runPlaygroundAnalysis();
    }
  }, [selectedInternshipId, mode]);

  const runInternshipAnalysis = async (internshipId) => {
    setLoading(true);
    try {
      if (isAuthenticated && isStudent) {
        // Authenticated student evaluation against live profile
        const res = await api.get(`/ai/analyze-internship/${internshipId}`);
        setAnalysis(res.data);
      } else {
        // Run against mock student profile for visitors
        const selected = internships.find((i) => i.id === Number(internshipId));
        if (selected) {
          const res = await api.post('/ai/analyze-gap/public', {
            roleTitle: selected.title,
            companyName: selected.companyName,
            userSkills: ['Java', 'Spring Boot', 'React', 'Git', 'SQL'],
            requiredSkills: selected.requiredSkills.map((s) => s.skillName),
            resumeText: 'Student experienced with Java, Spring Boot, React web components and relational databases.',
          });
          setAnalysis(res.data);
        }
      }
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  const runPlaygroundAnalysis = async () => {
    setLoading(true);
    try {
      const userSkillsArr = customUserSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const reqSkillsArr = customRequiredSkills.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await api.post('/ai/analyze-gap/public', {
        roleTitle: customRole,
        companyName: 'Target Tech Company',
        userSkills: userSkillsArr,
        requiredSkills: reqSkillsArr,
        resumeText: customResumeText,
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error('Playground analysis failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
          <Brain className="w-3.5 h-3.5" />
          <span>AI Career Copilot & Gap Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Skill Gap & Interview Advisor</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Compare any student profile against real industry roles. Discover your missing competencies, follow actionable 3-week study roadmaps, and practice role-specific technical interview questions.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => setMode('internship')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'internship'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Match Against Real Internship Postings
        </button>
        <button
          onClick={() => setMode('playground')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'playground'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Custom Skill Playground (Sandbox)
        </button>
      </div>

      {/* Control Input Area */}
      {mode === 'internship' ? (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select an Internship to Analyze:
            </label>
            <select
              value={selectedInternshipId}
              onChange={(e) => setSelectedInternshipId(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {internships.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title} — {i.companyName} ({i.workMode})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:self-end">
            <button
              onClick={() => runInternshipAnalysis(selectedInternshipId)}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Evaluating Model...' : 'Re-Evaluate Compatibility'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Job's Required Skills (comma separated)
              </label>
              <input
                type="text"
                value={customRequiredSkills}
                onChange={(e) => setCustomRequiredSkills(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Your Current Technical Skills (comma separated)
            </label>
            <input
              type="text"
              value={customUserSkills}
              onChange={(e) => setCustomUserSkills(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Resume Snippet or Project Bio
            </label>
            <textarea
              rows={2}
              value={customResumeText}
              onChange={(e) => setCustomResumeText(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={runPlaygroundAnalysis}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Evaluating...' : 'Analyze Custom Match'}
            </button>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse">
          <Brain className="w-10 h-10 text-cyan-400 mx-auto mb-3 animate-spin" />
          <h3 className="text-base font-bold text-white">Running AI Semantic Fit Analysis...</h3>
          <p className="text-xs text-slate-400 mt-1">Cross-referencing skill graph, weights, and proficiency vectors.</p>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          
          {/* Top Score Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Evaluation Verdict</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  {analysis.verdict}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {analysis.internshipTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {analysis.matchSummary}
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 flex items-baseline gap-1">
                <span>{Math.round(analysis.matchPercentage)}</span>
                <span className="text-2xl text-slate-400">%</span>
              </div>
              <span className="text-xs text-slate-400 mt-1 font-medium">Composite AI Match</span>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                activeTab === 'breakdown'
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Skill Overlap & Gap Matrix
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                activeTab === 'roadmap'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              3-Week Learning Roadmap
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                activeTab === 'interview'
                  ? 'bg-slate-800 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              AI Mock Interview Prep ({analysis.interviewPrepQuestions?.length || 0})
            </button>
          </div>

          {/* Tab 1: Breakdown Matrix */}
          {activeTab === 'breakdown' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Matched Strengths */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-bold text-white">Verified Matched Skills</h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
                    {analysis.matchedSkills?.length || 0} Met
                  </span>
                </div>

                <div className="space-y-3">
                  {analysis.matchedSkills && analysis.matchedSkills.length > 0 ? (
                    analysis.matchedSkills.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{item.skillName}</span>
                          <span className="text-[11px] font-mono text-emerald-400">
                            {item.userProficiency} (Req: {item.requiredProficiency})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {item.recommendation}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic py-4">No overlapping skills detected yet.</p>
                  )}
                </div>
              </div>

              {/* Missing Skills / Gaps */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <h3 className="text-base font-bold text-white">Identified Skill Gaps</h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-400 font-bold">
                    {analysis.missingSkills?.length || 0} Gaps
                  </span>
                </div>

                <div className="space-y-3">
                  {analysis.missingSkills && analysis.missingSkills.length > 0 ? (
                    analysis.missingSkills.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">{item.skillName}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-950/50 text-rose-400 border border-rose-500/30">
                            {item.isMandatory ? 'MANDATORY' : 'RECOMMENDED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {item.recommendation}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs">
                      🎉 Outstanding! No technical skill gaps detected for this role.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Learning Roadmap */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Our AI designed this curated weekly roadmap to bridge your exact gaps for this opening. Spend 5-7 hours per week to achieve readiness.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analysis.learningRoadmap && analysis.learningRoadmap.map((step, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        {step.phase}
                      </span>
                      <h4 className="text-base font-bold text-white leading-snug">{step.title}</h4>
                      <p className="text-xs text-cyan-300 font-mono">{step.focusArea}</p>
                      <p className="text-xs text-slate-400 leading-relaxed pt-2">
                        {step.actionPlan}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        Curated Resources:
                      </div>
                      <ul className="space-y-1.5">
                        {step.resources.map((res, rIdx) => (
                          <li key={rIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-400">•</span>
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Mock Interview Questions */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400 shrink-0" />
                <span>
                  These technical questions are generated specifically for {analysis.internshipTitle}. Practice answering using the key architecture points.
                </span>
              </div>

              <div className="space-y-4">
                {analysis.interviewPrepQuestions && analysis.interviewPrepQuestions.map((q, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                        Question #{idx + 1} • {q.skillFocus}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white leading-snug">
                      "{q.question}"
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <span className="font-semibold text-slate-300 block mb-1">Why Recruiters Ask This:</span>
                        <p className="text-slate-400 leading-relaxed">{q.whyItMatters}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/20">
                        <span className="font-semibold text-purple-300 block mb-1">Key Concepts to Mention:</span>
                        <p className="text-slate-300 leading-relaxed">{q.keyConceptsToMention}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AiSkillAdvisorPage;
