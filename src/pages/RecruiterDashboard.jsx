import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import MatchScoreBadge from '../components/MatchScoreBadge';
import StatusBadge from '../components/StatusBadge';
import SkillTag from '../components/SkillTag';
import { Building2, Users, Briefcase, Plus, CheckCircle2, MessageSquare, Clock, MapPin, Banknote, Sparkles, Trash2, Edit3, X } from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline', 'postings'
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter state for applicants
  const [selectedInternshipFilter, setSelectedInternshipFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // New posting form modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPosting, setNewPosting] = useState({
    title: '',
    companyName: '',
    location: 'Remote',
    workMode: 'REMOTE',
    category: 'Software Engineering',
    duration: '3 Months',
    stipendMonthly: 30000,
    openings: 2,
    description: '',
    responsibilities: '',
    perks: 'Certificate, Letter of Recommendation, Flexible Hours',
    deadline: '',
    requiredSkills: [
      { skillName: 'React', minimumLevel: 'INTERMEDIATE', isMandatory: true, weight: 4 },
      { skillName: 'JavaScript', minimumLevel: 'INTERMEDIATE', isMandatory: true, weight: 4 },
    ],
  });

  // New skill addition inside create modal
  const [modalSkillName, setModalSkillName] = useState('');
  const [modalSkillLevel, setModalSkillLevel] = useState('INTERMEDIATE');
  const [modalSkillMandatory, setModalSkillMandatory] = useState(true);

  // Status updating state
  const [updatingAppId, setUpdatingAppId] = useState(null);

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const fetchRecruiterData = async () => {
    setLoading(true);
    try {
      const [appsRes, postRes, statsRes, profRes] = await Promise.all([
        api.get('/applications/recruiter'),
        api.get('/internships/my-postings'),
        api.get('/analytics/dashboard'),
        api.get('/profile/recruiter'),
      ]);
      setApplications(appsRes.data);
      setInternships(postRes.data);
      setStats(statsRes.data);
      setProfile(profRes.data);
      setNewPosting((prev) => ({ ...prev, companyName: profRes.data?.companyName || 'My Tech Company' }));
    } catch (err) {
      console.error('Failed to load recruiter data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus, currentNotes) => {
    setUpdatingAppId(appId);
    try {
      const res = await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
        recruiterNotes: currentNotes,
      });

      setApplications(applications.map((a) => (a.id === appId ? res.data : a)));
    } catch (err) {
      console.error('Failed to update applicant status', err);
    } finally {
      setUpdatingAppId(null);
    }
  };

  const handleNotesUpdate = async (appId, notes, currentStatus) => {
    try {
      const res = await api.patch(`/applications/${appId}/status`, {
        status: currentStatus,
        recruiterNotes: notes,
      });
      setApplications(applications.map((a) => (a.id === appId ? res.data : a)));
    } catch (err) {
      console.error('Failed to update notes', err);
    }
  };

  const handleAddSkillToPosting = () => {
    if (!modalSkillName.trim()) return;
    setNewPosting({
      ...newPosting,
      requiredSkills: [
        ...newPosting.requiredSkills,
        {
          skillName: modalSkillName.trim(),
          minimumLevel: modalSkillLevel,
          isMandatory: modalSkillMandatory,
          weight: 4,
        },
      ],
    });
    setModalSkillName('');
  };

  const handleRemoveSkillFromPosting = (idx) => {
    const list = [...newPosting.requiredSkills];
    list.splice(idx, 1);
    setNewPosting({ ...newPosting, requiredSkills: list });
  };

  const handleCreatePosting = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post('/internships', newPosting);
      setInternships([res.data, ...internships]);
      setShowCreateModal(false);
      // Reset form
      setNewPosting({
        title: '',
        companyName: profile?.companyName || 'My Tech Company',
        location: 'Remote',
        workMode: 'REMOTE',
        category: 'Software Engineering',
        duration: '3 Months',
        stipendMonthly: 30000,
        openings: 2,
        description: '',
        responsibilities: '',
        perks: 'Certificate, Letter of Recommendation, Flexible Hours',
        deadline: '',
        requiredSkills: [
          { skillName: 'React', minimumLevel: 'INTERMEDIATE', isMandatory: true, weight: 4 },
          { skillName: 'JavaScript', minimumLevel: 'INTERMEDIATE', isMandatory: true, weight: 4 },
        ],
      });
    } catch (err) {
      console.error('Failed to create internship', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePosting = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship posting?')) return;
    try {
      await api.delete(`/internships/${id}`);
      setInternships(internships.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Failed to delete internship', err);
    }
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    if (selectedInternshipFilter !== 'ALL' && app.internshipId !== Number(selectedInternshipFilter)) {
      return false;
    }
    if (selectedStatusFilter !== 'ALL' && app.status !== selectedStatusFilter) {
      return false;
    }
    return true;
  });

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
      
      {/* Recruiter Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shrink-0 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-bold text-2xl text-cyan-400">
              <Building2 className="w-8 h-8" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{profile?.companyName}</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-semibold">
                Employer Portal
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Recruiter: <span className="font-semibold text-white">{user?.fullName}</span> ({user?.email})
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
              <span>{profile?.industry}</span>
              <span>• {profile?.location}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Internship</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Active Internship Postings</div>
          <div className="text-2xl font-extrabold text-white mt-1">{internships.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Total Applicants Received</div>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">{applications.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Shortlisted Talent</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="text-slate-400 text-xs font-medium">Avg. Candidate Match</div>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">
            {stats?.averageMatchScore || 85}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'pipeline'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Candidate Pipeline ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('postings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'postings'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          My Postings ({internships.length})
        </button>
      </div>

      {/* Tab 1: Candidate Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Filter by Role:</label>
                <select
                  value={selectedInternshipFilter}
                  onChange={(e) => setSelectedInternshipFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                >
                  <option value="ALL">All Active Roles</option>
                  {internships.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Filter by Status:</label>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-2 text-xs focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="OFFERED">Offered</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Ranked automatically by <span className="text-emerald-400 font-bold">AI Match Score</span>
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
              No applicants match the selected criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{app.studentName}</h3>
                        <span className="text-xs text-slate-400">({app.studentEmail})</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{app.studentHeadline || app.studentUniversity}</p>
                      <div className="text-[11px] text-cyan-400 font-mono mt-1">
                        Applied for: <span className="font-bold text-slate-200">{app.internshipTitle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MatchScoreBadge score={app.matchScore} size="md" />
                      <StatusBadge status={app.status} />
                    </div>
                  </div>

                  {/* Cover letter & resume snapshot */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-slate-400 font-semibold block mb-1">Cover Note:</span>
                      <p className="text-slate-300 leading-relaxed italic">"{app.coverLetter}"</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <span className="text-slate-400 font-semibold block mb-1">Skills Snapshot:</span>
                      <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
                        {app.studentResumeText || 'Verified profile skills match required criteria.'}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Feedback Row */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Update Status:</span>
                      <select
                        value={app.status}
                        disabled={updatingAppId === app.id}
                        onChange={(e) => handleStatusChange(app.id, e.target.value, app.recruiterNotes)}
                        className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="APPLIED">Applied</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="SHORTLISTED">Shortlist Candidate</option>
                        <option value="INTERVIEW_SCHEDULED">Schedule Interview</option>
                        <option value="OFFERED">Extend Offer</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        defaultValue={app.recruiterNotes || ''}
                        placeholder="Leave recruiter feedback / notes for candidate..."
                        onBlur={(e) => handleNotesUpdate(app.id, e.target.value, app.status)}
                        className="flex-1 sm:w-80 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manage Postings */}
      {activeTab === 'postings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((posting) => (
              <div
                key={posting.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-white">{posting.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold uppercase">
                      {posting.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{posting.category} • {posting.workMode}</p>
                  
                  <div className="mt-3 text-xs text-slate-300 space-y-1">
                    <div>Stipend: <span className="font-semibold text-emerald-400">₹{posting.stipendMonthly?.toLocaleString()}/mo</span></div>
                    <div>Duration: {posting.duration} • {posting.openings} Openings</div>
                    <div>Applicants: <span className="font-bold text-cyan-400">{posting.applicantCount || 0}</span></div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {posting.requiredSkills && posting.requiredSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                        {s.skillName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Posted on {new Date(posting.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDeletePosting(posting.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Internship Posting */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl my-8">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Post a New Internship Opportunity</h2>
            <p className="text-xs text-slate-400 mb-6">
              Specify technical skill expectations so our AI engine can accurately index and rank candidates.
            </p>

            <form onSubmit={handleCreatePosting} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={newPosting.title}
                    onChange={(e) => setNewPosting({ ...newPosting, title: e.target.value })}
                    placeholder="e.g. Backend Microservices Engineer Intern"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newPosting.category}
                    onChange={(e) => setNewPosting({ ...newPosting, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                  >
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Product & Design">Product & Design</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Work Mode</label>
                  <select
                    value={newPosting.workMode}
                    onChange={(e) => setNewPosting({ ...newPosting, workMode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ON_SITE">On-Site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Monthly Stipend (₹)</label>
                  <input
                    type="number"
                    value={newPosting.stipendMonthly}
                    onChange={(e) => setNewPosting({ ...newPosting, stipendMonthly: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Openings</label>
                  <input
                    type="number"
                    min="1"
                    value={newPosting.openings}
                    onChange={(e) => setNewPosting({ ...newPosting, openings: parseInt(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Required Skills Manager inside create modal */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-slate-300 font-bold">Target Required Skills</label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={modalSkillName}
                    onChange={(e) => setModalSkillName(e.target.value)}
                    placeholder="Skill name (e.g. Spring Boot, Docker)..."
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none"
                  />
                  <select
                    value={modalSkillLevel}
                    onChange={(e) => setModalSkillLevel(e.target.value)}
                    className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                  <label className="flex items-center gap-1 text-slate-400">
                    <input
                      type="checkbox"
                      checked={modalSkillMandatory}
                      onChange={(e) => setModalSkillMandatory(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    Mandatory
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSkillToPosting}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                  >
                    Add Skill
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {newPosting.requiredSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-200"
                    >
                      <span>{s.skillName} ({s.minimumLevel})</span>
                      {s.isMandatory && <span className="text-amber-400 font-bold">*</span>}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillFromPosting(idx)}
                        className="text-slate-500 hover:text-rose-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Role Description</label>
                <textarea
                  rows={3}
                  required
                  value={newPosting.description}
                  onChange={(e) => setNewPosting({ ...newPosting, description: e.target.value })}
                  placeholder="Describe the mission, squad structure, and project goals..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Key Responsibilities</label>
                <textarea
                  rows={2}
                  value={newPosting.responsibilities}
                  onChange={(e) => setNewPosting({ ...newPosting, responsibilities: e.target.value })}
                  placeholder="1. Build REST endpoints\n2. Optimize query performance..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
                >
                  {creating ? 'Publishing...' : 'Publish Internship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
