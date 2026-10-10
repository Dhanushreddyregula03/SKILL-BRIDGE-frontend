import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Send, CheckCircle2, AlertCircle, Sparkles, Building2, MapPin } from 'lucide-react';
import api from '../api/client';
import MatchScoreBadge from './MatchScoreBadge';

export const ApplyModal = ({ internship, isOpen, onClose, onSuccess }) => {
  const [coverLetter, setCoverLetter] = useState(
    `Hello hiring team,\n\nI am thrilled to apply for the ${internship?.title} role at ${internship?.companyName}. My technical background and practical experience align directly with your required stack. I am excited to contribute and grow with your team!`
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !internship) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await api.post('/applications', {
        internshipId: internship.id,
        coverLetter: coverLetter,
      });

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b']
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Application Submitted!</h3>
            <p className="text-sm text-slate-300 max-w-sm mb-4">
              Your profile and AI match score have been delivered directly to the hiring squad at <span className="text-emerald-400 font-semibold">{internship.companyName}</span>.
            </p>
            <p className="text-xs text-slate-400">Closing automatically...</p>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 p-1 flex items-center justify-center shrink-0">
                {internship.companyLogo ? (
                  <img src={internship.companyLogo} alt={internship.companyName} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Building2 className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-snug">{internship.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="text-slate-300 font-medium">{internship.companyName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {internship.location}</span>
                </div>
              </div>
            </div>

            {/* Match score preview */}
            {internship.userMatchScore !== undefined && (
              <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Your AI Profile Compatibility
                </span>
                <MatchScoreBadge score={internship.userMatchScore} size="sm" />
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Cover Letter / Introduction Note
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  required
                  placeholder="Introduce yourself and highlight why your skills make you the ideal intern for this role..."
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                ></textarea>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: Mentioning specific projects from your GitHub profile increases interview callback rates by 40%.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting Application...' : 'Send Application'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
