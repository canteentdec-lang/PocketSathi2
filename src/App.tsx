import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Coach from './components/Coach';
import UPIAnalyzer from './components/UPIAnalyzer';
import DebtDetector from './components/DebtDetector';
import InvestmentCalculators from './components/InvestmentCalculators';
import LearnHub from './components/LearnHub';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import OnboardingModal from './components/OnboardingModal';
import ProfileSummaryModal from './components/ProfileSummaryModal';
import ScrollToTop from './components/ScrollToTop';
import { useLocalStorage, useUserData } from './hooks/useData';
import { UserData } from './types';

export default function App() {
  const { users, currentUser, signup, login, logout, currentUserEmail } = useLocalStorage();
  const { userData, updateUserData, addTransaction, updateTransactions, saveOnboarding } = useUserData(currentUserEmail);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ps_theme');
    return saved === 'light' ? false : true; // Default to dark
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ps_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ps_theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (currentUser && !currentUser.onboarded) {
      setIsOnboardingOpen(true);
    }
  }, [currentUser]);

  const handleProfileClick = () => {
    if (currentUser?.onboarded && userData.onboarding) {
       setIsProfileOpen(true);
    } else {
       setIsOnboardingOpen(true);
    }
  };

  const handleUpdateCourseProgress = (courseId: string, lessonId: string) => {
    const currentProgress = userData.courseProgress[courseId] || [];
    const newProgress = currentProgress.includes(lessonId)
      ? currentProgress.filter(id => id !== lessonId)
      : [...currentProgress, lessonId];
    
    updateUserData({
      courseProgress: {
        ...userData.courseProgress,
        [courseId]: newProgress
      }
    });
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen font-sans selection:bg-brand-amber selection:text-brand-navy bg-white dark:bg-brand-navy text-brand-navy dark:text-white transition-colors duration-300 flex flex-col items-center">
        <Navbar 
          currentUser={currentUser} 
          onLoginClick={() => setIsAuthModalOpen(true)} 
          onLogout={logout}
          onProfileClick={handleProfileClick}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
        />

        <main className="pt-20 w-full max-w-[90%] flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={
              <Home 
                currentUser={currentUser}
                userData={userData}
                onLoginPrompt={() => setIsAuthModalOpen(true)}
                onEditProfile={handleProfileClick}
              />
            } />
            
            <Route path="/coach" element={
              <Coach 
                currentUser={currentUser}
                userData={userData}
                onUpdateUserData={updateUserData}
                onLoginPrompt={() => setIsAuthModalOpen(true)}
              />
            } />

            <Route path="/upi" element={
              <UPIAnalyzer 
                currentUser={currentUser}
                userData={userData}
                onUpdateTransactions={updateTransactions}
                onLoginPrompt={() => setIsAuthModalOpen(true)}
              />
            } />

            <Route path="/debt" element={
              <DebtDetector 
                currentUser={currentUser}
                userData={userData}
                onUpdateAnalyses={(as) => updateUserData({ debtAnalyses: as })}
                onLoginPrompt={() => setIsAuthModalOpen(true)}
              />
            } />

            <Route path="/investment" element={
              <InvestmentCalculators 
                currentUser={currentUser}
                userData={userData}
                onUpdateCalculations={(cs) => updateUserData({ savedCalculations: cs })}
                onLoginPrompt={() => setIsAuthModalOpen(true)}
              />
            } />

            <Route path="/learn" element={
              <LearnHub 
                currentUser={currentUser}
                userData={userData}
                onUpdateUserData={updateUserData}
                onUpdateCourseProgress={handleUpdateCourseProgress}
                onLoginPrompt={() => setIsAuthModalOpen(true)}
              />
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          users={users}
          onSuccess={(user) => {
            if (users.find(u => u.email === user.email)) {
               login(user.email);
            } else {
               signup(user);
            }
            setIsAuthModalOpen(false);
          }}
        />

        <OnboardingModal 
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          initialData={userData.onboarding}
          onComplete={(data) => {
            saveOnboarding(data);
            setIsOnboardingOpen(false);
          }}
        />

        {userData.onboarding && (
          <ProfileSummaryModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            initialData={userData.onboarding}
            onUpdate={(data) => saveOnboarding(data)}
          />
        )}
      </div>
    </BrowserRouter>
  );
}
