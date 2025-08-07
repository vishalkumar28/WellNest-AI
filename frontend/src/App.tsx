import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { GuestProvider, useGuest } from './contexts/GuestContext';
import { WellnessProvider } from './contexts/WellnessContext';
import { AppProvider, useAppContext, TabType } from './contexts/AppContext';
import { AuthForm } from './components/AuthForm';
import { LandingPage } from './components/LandingPage';
import { Navigation } from './components/Navigation';
import { DailyCheckin } from './components/DailyCheckin';
import { Dashboard } from './components/Dashboard';
import { HealthcareChatbot } from './components/HealthcareChatbot';
import { LoadingSpinner } from './components/LoadingSpinner';
import { GuestModeBanner } from './components/GuestModeBanner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NewChatPage } from './components/NewChatPage';
import Profile from './components/Profile';
import HomePage from './components/HomePage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ContactUs from './components/ContactUs';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { isGuestMode, setGuestMode } = useGuest();
  const { activeTab, setActiveTab } = useAppContext();
  const [showGuestBanner, setShowGuestBanner] = useState(true);
  const [showLandingPage, setShowLandingPage] = useState(true);
  
  // Check URL parameters and set initial page state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authParam = urlParams.get('auth');
    const appParam = urlParams.get('app');
    const tabParam = urlParams.get('tab');
    
    if (authParam === 'true' && !user && !isGuestMode) {
      setShowLandingPage(false);
      // Remove the auth parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    // If app=true parameter is present, skip landing page and go directly to app
    // This is used for internal navigation after authentication
    if (appParam === 'true') {
      setShowLandingPage(false);
      // Remove the app parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (user) {
      // If user is authenticated, skip landing page and show the app directly
      setShowLandingPage(false);
    } else if (!user && !isGuestMode) {
      // Show landing page only for unauthenticated users who are not in guest mode
      setShowLandingPage(true);
    }
    
    // Handle tab parameter for direct navigation to specific tabs
    if (tabParam && ['home', 'checkin', 'dashboard', 'chat', 'profile', 'privacy', 'terms', 'contact'].includes(tabParam)) {
      setActiveTab(tabParam as TabType);
      setShowLandingPage(false);
    }
  }, [user, isGuestMode, setActiveTab]);
  
  // Listen for custom navigation events from the landing page
  useEffect(() => {
    const handleNavigate = (event: CustomEvent) => {
      if (event.detail && event.detail.tab) {
        setActiveTab(event.detail.tab);
      }
    };
    
    window.addEventListener('navigate', handleNavigate as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigate as EventListener);
    };
  }, []);

  // Add debugging
  console.log('AppContent: Current state:', {
    user: user ? { id: user.id, email: user.email } : null,
    loading,
    isGuestMode,
    activeTab,
    showLandingPage
  });

  if (loading) {
    console.log('AppContent: Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-white">Loading WellNest...</p>
        </div>
      </div>
    );
  }

  // Show landing page if no user and not in guest mode
  if (!user && !isGuestMode && showLandingPage) {
    console.log('AppContent: Showing landing page');
    return (
      <LandingPage
        onGuestMode={() => {
          console.log('AppContent: Switching to guest mode');
          setGuestMode(true);
          setShowLandingPage(false);
        }}
        onSignIn={() => {
          console.log('AppContent: User clicked sign in');
          setShowLandingPage(false);
        }}
      />
    );
  }

  // Show auth form if no user and not in guest mode
  if (!user && !isGuestMode) {
    console.log('AppContent: Showing auth form');
    return (
      <AuthForm 
        onBack={() => {
          console.log('AppContent: User clicked back to landing page');
          setShowLandingPage(true);
        }}
      />
    );
  }

  console.log('AppContent: User authenticated or in guest mode, showing main app');

  const handleNavigateToDashboard = () => {
    console.log('AppContent: Navigating to dashboard');
    setActiveTab('dashboard');
  };

  const renderActiveTab = () => {
    console.log('AppContent: Rendering active tab:', activeTab);
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'checkin':
        return <DailyCheckin onNavigateToDashboard={handleNavigateToDashboard} />;
      case 'dashboard':
        console.log('AppContent: Rendering Dashboard component');
        return <Dashboard />;
      case 'chat':
        return <NewChatPage />;
      case 'profile':
        return <Profile />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsOfService />;
      case 'contact':
        return <ContactUs />;
      default:
        return <HomePage />;
    }
  };

  return (
    <WellnessProvider>
      <ChatProvider>
        <div className="min-h-screen relative overflow-hidden">
          {/* Enhanced Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            {/* Multiple layered backgrounds */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-800/50 via-pink-800/30 to-indigo-800/50"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-800/30 via-cyan-800/20 to-green-800/30"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{ 
                  y: [0, -30, 0],
                  rotate: [0, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 blur-3xl"
              />
              <motion.div
                animate={{ 
                  y: [0, 30, 0],
                  rotate: [0, -5, 0],
                  scale: [1, 0.9, 1]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-3xl"
              />
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  x: [0, 15, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 12, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-20 left-1/3 w-56 h-56 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-20 blur-3xl"
              />
              <motion.div
                animate={{ 
                  y: [0, 25, 0],
                  x: [0, -10, 0],
                  rotate: [0, 3, 0]
                }}
                transition={{ 
                  duration: 9, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-15 blur-2xl"
              />
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  x: [0, 8, 0],
                  rotate: [0, -2, 0]
                }}
                transition={{ 
                  duration: 11, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-15 blur-2xl"
              />
            </div>
          </div>

          {/* Guest Mode Banner */}
          {isGuestMode && showGuestBanner && (
            <GuestModeBanner
              onSignUp={() => {
                setGuestMode(false);
                setShowLandingPage(false);
              }}
              onClose={() => setShowGuestBanner(false)}
            />
          )}

          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="max-w-7xl mx-auto py-6 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
              >
                {renderActiveTab()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Healthcare Chatbot */}
          <HealthcareChatbot />
        </div>
      </ChatProvider>
    </WellnessProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GuestProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </GuestProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;