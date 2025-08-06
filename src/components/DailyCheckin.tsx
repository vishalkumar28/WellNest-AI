import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Moon, Brain, Activity, ChevronLeft, ChevronRight, Check, BarChart3 } from 'lucide-react';
import { useWellness } from '../contexts/WellnessContext';
import { useGuest } from '../contexts/GuestContext';
import { useAuth } from '../contexts/AuthContext';
import { wellnessApi } from '../services/wellnessApi';
import { EnhancedSlider } from './EnhancedSlider';
import { ConfettiCelebration } from './ConfettiCelebration';
import { Notification } from './Notification';
import { AuthModal } from './AuthModal';

const steps = [
  {
    id: 'mood',
    title: 'How are you feeling today?',
    icon: Heart,
    field: 'moodRating',
    min: 1,
    max: 10,
    labels: ['😢', '😕', '😐', '🙂', '😊'],
    color: 'from-pink-500 to-red-500'
  },
  {
    id: 'energy',
    title: 'What\'s your energy level?',
    icon: Zap,
    field: 'energyLevel',
    min: 1,
    max: 10,
    labels: ['🪫', '🔋', '🔋', '🔋', '⚡'],
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'sleep',
    title: 'How did you sleep?',
    icon: Moon,
    field: 'sleepQuality',
    min: 1,
    max: 10,
    labels: ['😴', '😪', '😐', '😊', '✨'],
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'stress',
    title: 'How stressed do you feel?',
    icon: Brain,
    field: 'stressLevel',
    min: 1,
    max: 10,
    labels: ['😌', '😐', '😰', '😫', '🤯'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'activity',
    title: 'Physical Activity',
    icon: Activity,
    field: 'exerciseMinutes',
    min: 0,
    max: 180,
    labels: ['0', '45', '90', '135', '180'],
    suffix: ' min',
    color: 'from-green-500 to-emerald-500'
  }
];

interface DailyCheckinProps {
  onNavigateToDashboard?: () => void;
}

export const DailyCheckin: React.FC<DailyCheckinProps> = ({ onNavigateToDashboard }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'warning' | 'error' } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [savedLocally, setSavedLocally] = useState(false);
  const { currentEntry, updateCurrentEntry, submitEntry } = useWellness();
  const { isGuestMode, addGuestEntry, setGuestMode } = useGuest();
  const { user } = useAuth();

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleValueChange = (value: number) => {
    updateCurrentEntry({ [currentStepData.field]: value });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isGuestMode) {
        // For guest mode, add to guest entries
        addGuestEntry(currentEntry);
        setIsComplete(true);
        setShowConfetti(true);
        setNotification({
          message: 'Wellness data saved in guest mode!',
          type: 'success'
        });
      } else if (user) {
        // For authenticated users, submit to wellness context
        try {
          await submitEntry();
          setIsComplete(true);
          setShowConfetti(true);
          setNotification({
            message: 'Wellness data saved successfully to your account!',
            type: 'success'
          });
        } catch (error) {
          console.error('Backend submission failed:', error);
          
          // If authentication failed, offer to save as guest or retry
          if (error.message.includes('Authentication')) {
            setNotification({
              message: 'Authentication issue. Would you like to save in guest mode?',
              type: 'warning'
            });
            // Automatically switch to guest mode as fallback
            setGuestMode(true);
            addGuestEntry(currentEntry);
            setIsComplete(true);
            setShowConfetti(true);
          } else if (error.message.includes('Data saved locally')) {
            // Backend failed but data was saved locally
            setSavedLocally(true);
            setIsComplete(true);
            setShowConfetti(true);
            setNotification({
              message: 'Data saved locally. Backend connection failed, but your data is safe!',
              type: 'warning'
            });
          } else {
            // For other errors, show error message
            setNotification({
              message: error.message || 'Failed to submit wellness entry. Please try again.',
              type: 'error'
            });
          }
        }
      } else {
        // User is not authenticated, show auth modal
        setAuthMode('login');
        setShowAuthModal(true);
        // Don't complete the submission yet - wait for auth or guest mode choice
        return;
      }
    } catch (error) {
      console.error('Submission error:', error);
      setNotification({
        message: 'Failed to submit wellness entry. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuthSuccess = async () => {
    // After successful authentication, try to submit the entry
    try {
      await submitEntry();
      setIsComplete(true);
      setShowConfetti(true);
      setShowAuthModal(false);
      setNotification({
        message: 'Wellness data saved successfully to your account!',
        type: 'success'
      });
    } catch (error) {
      console.error('Error submitting after auth:', error);
      
      // If still having issues, offer guest mode as fallback
      if (error.message.includes('Authentication') || error.message.includes('Failed to save')) {
        setNotification({
          message: 'Still having issues. Would you like to save in guest mode?',
          type: 'warning'
        });
        // Automatically switch to guest mode as fallback
        setGuestMode(true);
        addGuestEntry(currentEntry);
        setIsComplete(true);
        setShowConfetti(true);
        setShowAuthModal(false);
      } else if (error.message.includes('Data saved locally')) {
        // Backend failed but data was saved locally
        setSavedLocally(true);
        setIsComplete(true);
        setShowConfetti(true);
        setShowAuthModal(false);
        setNotification({
          message: 'Data saved locally. Backend connection failed, but your data is safe!',
          type: 'warning'
        });
      } else {
        setNotification({
          message: error.message || 'Failed to submit wellness entry. Please try again.',
          type: 'error'
        });
      }
    }
  };

  const handleGuestMode = () => {
    setGuestMode(true);
    addGuestEntry(currentEntry);
    setIsComplete(true);
    setShowConfetti(true);
    setShowAuthModal(false);
    setNotification({
      message: 'Data saved in guest mode. Sign up later to save permanently!',
      type: 'info'
    });
  };

  // Test function to verify backend connection
  const testBackendConnection = async () => {
    try {
      const isHealthy = await wellnessApi.wellness.checkBackendHealth();
      if (isHealthy) {
        setNotification({
          message: 'Backend is running and healthy!',
          type: 'success'
        });
      } else {
        setNotification({
          message: 'Backend is not responding',
          type: 'error'
        });
      }
    } catch (error) {
      setNotification({
        message: 'Backend test failed',
        type: 'error'
      });
    }
  };

  if (isComplete) {
    return (
      <>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          onGuestMode={handleGuestMode}
          mode={authMode}
        />
        <div className="max-w-lg mx-auto p-6">
        <ConfettiCelebration 
          trigger={showConfetti} 
          onComplete={() => setShowConfetti(false)} 
        />
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check-in Complete!</h2>
          <p className="text-gray-600 mb-6">
            {isGuestMode 
              ? "Great job tracking your wellness! Your data has been saved in guest mode. Sign up to save your data permanently and access all features."
              : savedLocally
                ? "Great job tracking your wellness today! Your data has been saved locally. We'll sync with the server when the connection is restored."
                : "Great job tracking your wellness today. Your data has been saved and will help us provide better insights."
            }
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsComplete(false);
                setCurrentStep(0);
                updateCurrentEntry({});
              }}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-green-600 transition-all flex items-center space-x-2"
            >
              <span>Start New Check-in</span>
            </motion.button>
            
            {onNavigateToDashboard && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateToDashboard}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>View Dashboard</span>
              </motion.button>
            )}
          </div>
        </div>
        </div>
      </>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        onGuestMode={handleGuestMode}
        mode={authMode}
      />
      <div className="max-w-lg mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-white bg-white/10 px-3 py-1 rounded-full shadow-inner">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-medium text-white bg-white/10 px-3 py-1 rounded-full shadow-inner">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200/30 backdrop-blur-sm rounded-full h-3 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-3 rounded-full bg-gradient-to-r ${currentStepData.color} shadow-lg`}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl"
        >
          {/* Icon */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${currentStepData.color} flex items-center justify-center shadow-lg border-4 border-white/20`}
          >
            <currentStepData.icon className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h2 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent shadow-text"
          >
            {currentStepData.title}
          </motion.h2>

          {/* Value Display */}
          <div className="mb-8">
            <div
              className="text-6xl font-bold mb-2"
              style={{ 
                background: `linear-gradient(135deg, ${currentStepData.color.split(' ')[1]}, ${currentStepData.color.split(' ')[3]})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {(currentEntry as any)[currentStepData.field] || currentStepData.min}
              {currentStepData.suffix && (
                <span className="text-2xl ml-1">{currentStepData.suffix}</span>
              )}
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              {currentStepData.labels.map((label, index) => (
                <span key={index} className="text-lg">
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <EnhancedSlider
              value={(currentEntry as any)[currentStepData.field] || currentStepData.min}
              onChange={handleValueChange}
              min={currentStepData.min}
              max={currentStepData.max}
              labels={currentStepData.labels}
              suffix={currentStepData.suffix || ''}
              color={currentStepData.color}
            />
          </div>

                     {/* Navigation Buttons */}
           <div className="flex justify-between items-center">
             <div className="flex items-center space-x-2">
               <button
                 onClick={prevStep}
                 disabled={currentStep === 0}
                 className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                   currentStep === 0
                     ? 'text-gray-400 cursor-not-allowed'
                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                 }`}
               >
                 <ChevronLeft className="w-5 h-5 mr-1" />
                 Previous
               </button>
               
               {/* Test button - remove this later */}
               <button
                 onClick={testBackendConnection}
                 className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
               >
                 Test Backend
               </button>
             </div>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                    {isGuestMode ? 'Saving...' : 'Submitting...'}
                  </div>
                ) : (
                  'Complete Check-in'
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      </div>
    </>
  );
};