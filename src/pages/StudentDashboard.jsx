import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import MatchScoreBadge from '../components/MatchScoreBadge';
import StatusBadge from '../components/StatusBadge';
import SkillTag from '../components/SkillTag';
import { User, Briefcase, Plus, Trash2, Save, Sparkles, Building2, CheckCircle, ExternalLink, GraduationCap, Github, Linkedin, Globe } from 'lucide-react';

export const StudentDashboard = ({ onNavigate, onSelectInternship, onAnalyzeInternship }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'profile'
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New skill input state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('INTERMEDIATE');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes, profRes] = await Promise.all([
        api.get('/applications/student'),
        api.get('/analytics/dashboard'),
        api.get('/profile/student'),
      ]);
      setApplications(appsRes.data);
      setStats(statsRes.data);
      setProfile(profRes.data);
    } catch (err) {
      console.error('Failed to load student dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const updatedSkills = [
      ...(profile.skills || []),
      { skillName: newSkillName.trim(), level: newSkillLevel, experienceMonths: 12 },
    ];

    setProfile({ ...profile, skills: updatedSkills });
    setNewSkillName('');
  };

  const handleRemoveSkill = (index) => {
    const updated = [...profile.skills];
    updated.splice(index, 1);
    setProfile({ ...profile, skills: updated });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await api.put('/profile/student', profile);
      setProfile(res.data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-32 bg-slate-900 rounded-3xl border border-slate-800"></div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 bg-slate-900 rounded-2xl border border-slate-800"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Student Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shrink-0 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-2xl text-emerald-400">
              {profile?.fullName ? profile.fullName.charAt(0) : 'S'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{profile?.fullName}</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold">
                Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">{profile?.headline}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                {profile?.degree} • {profile?.university}
              </span>
              {profile?.cgpa && <span>• CGPA: {profile?.cgpa}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            Edit Profile & Skills
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
          >
            Find New Internships
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Total Applied</div>
          <div className="text-2xl font-extrabold text-white mt-1">{stats?.activeApplications || 0}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Shortlisted / Interviews</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{stats?.shortlistedCount || 0}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Average AI Match Score</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {stats?.averageMatchScore || 0}%
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Verified Skills</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">{profile?.skills?.length || 0}</div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'applications'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'profile'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Skill Inventory & Resume
        </button>
      </div>

      {/* Tab 1: Applications Tracker */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No applications yet</h3>
              <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
                Explore recommended internships and apply using your AI-computed profile.
              </p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
              >
                Browse Internships
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 p-1 flex items-center justify-center shrink-0">
                      {app.companyLogo ? (
                        <img src={app.companyLogo} alt={app.companyName} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building2 className="w-6 h-6 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{app.internshipTitle}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-slate-300 font-medium">{app.companyName}</span>
                        <span>•</span>
                        <span>{app.location}</span>
                        <span>•</span>
                        <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                      </div>

                      {app.recruiterNotes && (
                        <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                          <span className="text-cyan-400 font-semibold">Recruiter Feedback: </span>
                          <span>{app.recruiterNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0 self-end md:self-center">
                    <MatchScoreBadge score={app.matchScore} size="sm" />
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Skill Inventory & Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-8">
          
          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Profile and skill matrix updated successfully! Real-time match scores recalculated.</span>
            </div>
          )}

          {/* Section: Technical Skill Inventory */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  Technical Skill Inventory
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add technical skills, tools, and languages to calibrate the AI matching algorithm.
                </p>
              </div>

              {/* Add Skill Form Inline */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Docker, React, AWS..."
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm shadow-emerald-500/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </div>
            </div>

            {/* Current Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile?.skills && profile.skills.map((skill, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-semibold text-white text-xs block">{skill.skillName}</span>
                    <span className="text-[10px] text-cyan-400 font-mono capitalize">
                      {skill.level.toLowerCase()} proficiency
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Academic Background & Resume */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white">Academic Details & Resume Text</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">University / College</label>
                <input
                  type="text"
                  value={profile?.university || ''}
                  onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Degree & Major</label>
                <input
                  type="text"
                  value={profile?.degree || ''}
                  onChange={(e) => setProfile({ ...profile, degree: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">CGPA / GPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={profile?.cgpa || ''}
                  onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  value={profile?.githubUrl || ''}
                  onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={profile?.linkedinUrl || ''}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Portfolio / Website</label>
                <input
                  type="url"
                  value={profile?.portfolioUrl || ''}
                  onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 text-xs">
                Resume Content / Project Summary (Analyzed by AI Semantic Engine)
              </label>
              <textarea
                rows={4}
                value={profile?.resumeText || ''}
                onChange={(e) => setProfile({ ...profile, resumeText: e.target.value })}
                placeholder="Paste key bullet points from your resume: projects built, architectures, frameworks used, Git workflows..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Updating...' : 'Save Profile & Recalculate Matches'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default StudentDashboard;
