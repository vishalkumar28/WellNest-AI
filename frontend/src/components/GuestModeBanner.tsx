import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, X, UserPlus, Save, Clock } from 'lucide-react';
import { useGuest } from '../contexts/GuestContext';

interface GuestModeBannerProps {
  onSignUp: () => void;
  onClose: () => void;
}

export const GuestModeBanner: React.FC<GuestModeBannerProps> = ({ onSignUp, onClose }) => {
  const { guestEntries } = useGuest();
  const [timeRemaining, setTimeRemaining] = useState<number>(24 * 60 * 60); // 24 hours in seconds
  
  // Simulate a countdown for guest session expiration
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format the remaining time
  const formatTimeRemaining = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };
  
  const isExpiringSoon = timeRemaining < 3600; // Less than 1 hour

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-white" />
            <div>
              <h3 className="font-semibold text-lg">Guest Mode</h3>
              <p className="text-amber-100 text-sm">
                {guestEntries.length > 0 
                  ? `You have ${guestEntries.length} entry${guestEntries.length > 1 ? 'ies' : ''} in guest mode. Sign up to save your data permanently!`
                  : "You're exploring in guest mode. Sign up to save your wellness data and access all features!"
                }
                {isExpiringSoon && (
                  <span className="ml-1 font-semibold text-white animate-pulse">
                    Guest session expires in {formatTimeRemaining()}! Please sign in to save your data.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isExpiringSoon && (
            <div className="flex items-center space-x-2 text-white animate-pulse">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Expires in {formatTimeRemaining()}</span>
            </div>
          )}
          {guestEntries.length > 0 && (
            <div className="flex items-center space-x-2 text-amber-100">
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">{guestEntries.length} entries</span>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSignUp}
            className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-amber-50 transition-all flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up to Save</span>
          </motion.button>
          
          <button
            onClick={onClose}
            className="text-white hover:text-amber-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};