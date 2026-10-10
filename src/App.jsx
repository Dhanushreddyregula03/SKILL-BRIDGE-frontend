import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ApplyModal from './components/ApplyModal';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import InternshipDetailPage from './pages/InternshipDetailPage';
import AiSkillAdvisorPage from './pages/AiSkillAdvisorPage';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const AppContent = () => {
  const { isAuthenticated, isStudent, isRecruiter } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);
  const [advisorInternship, setAdvisorInternship] = useState(null);
  const [searchParam, setSearchParam] = useState('');

  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [internshipToApply, setInternshipToApply] = useState(null);

  const handleNavigate = (page, params = {}) => {
    if (params.search !== undefined) {
      setSearchParam(params.search);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectInternship = (internship) => {
    setSelectedInternshipId(internship.id);
    handleNavigate('detail');
  };

  const handleAnalyzeInternship = (internship) => {
    setAdvisorInternship(internship);
    handleNavigate('advisor');
  };

  const handleApplyInternship = (internship) => {
    if (!isAuthenticated) {
      handleNavigate('login');
      return;
    }
    setInternshipToApply(internship);
    setApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      <Navbar currentTab={currentPage} onNavigate={handleNavigate} />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectInternship={handleSelectInternship}
            onAnalyzeInternship={handleAnalyzeInternship}
            onApplyInternship={handleApplyInternship}
          />
        )}

        {currentPage === 'explore' && (
          <ExplorePage
            initialSearch={searchParam}
            onSelectInternship={handleSelectInternship}
            onAnalyzeInternship={handleAnalyzeInternship}
            onApplyInternship={handleApplyInternship}
          />
        )}

        {currentPage === 'detail' && (
          <InternshipDetailPage
            internshipId={selectedInternshipId}
            onBack={() => handleNavigate('explore')}
            onApply={handleApplyInternship}
            onAnalyze={handleAnalyzeInternship}
          />
        )}

        {currentPage === 'advisor' && (
          <AiSkillAdvisorPage
            preselectedInternship={advisorInternship}
            onApplyInternship={handleApplyInternship}
          />
        )}

        {currentPage === 'student-dashboard' && (
          <StudentDashboard
            onNavigate={handleNavigate}
            onSelectInternship={handleSelectInternship}
            onAnalyzeInternship={handleAnalyzeInternship}
          />
        )}

        {currentPage === 'recruiter-dashboard' && (
          <RecruiterDashboard />
        )}

        {currentPage === 'login' && (
          <LoginPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'register' && (
          <RegisterPage onNavigate={handleNavigate} />
        )}
      </main>

      <Footer />

      {/* Global Apply Modal */}
      <ApplyModal
        isOpen={applyModalOpen}
        internship={internshipToApply}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={() => {
          // If on student dashboard or explore, data will re-render
        }}
      />
    </div>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
