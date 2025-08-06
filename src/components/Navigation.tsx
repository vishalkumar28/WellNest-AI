import React from 'react';
import { motion } from 'framer-motion';
import { Heart, BarChart3, MessageSquare, LogOut, User, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGuest } from '../contexts/GuestContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAccessibilityClick?: () => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'checkin', label: 'Check-in', icon: Heart },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'chat', label: 'Chat', icon: MessageSquare }
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onAccessibilityClick }) => {
  const { user, logout } = useAuth();
  const { isGuestMode, setGuestMode } = useGuest();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  console.log('Navigation: Current activeTab:', activeTab);
  
  // Add click outside listener to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown && !dropdown.classList.contains('hidden')) {
          dropdown.classList.add('hidden');
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (isGuestMode) {
      // Exit guest mode and redirect to login page
      setGuestMode(false);
      // Force a page reload to show the login screen
      window.location.href = '/';
    } else {
      // Regular logout for authenticated users
      logout();
    }
    
    // Close the dropdown menu after logout action
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
      dropdown.classList.add('hidden');
    }
  };

  const handleTabChange = (tabId: string) => {
    console.log('Navigation: Tab clicked:', tabId);
    onTabChange(tabId);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with link to home page */}
          <div className="flex items-center">
            <button 
              onClick={() => {
                // Navigate to home tab when logo is clicked
                handleTabChange('home');
              }} 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity hover:scale-105 transition-transform duration-200"
              aria-label="Go to home page"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">WellNest</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-purple-300'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-purple-500/20 rounded-lg -z-10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Logout/Exit Guest Mode Button - Always visible */}
            {isGuestMode ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-amber-500/30 hover:bg-amber-500/50 text-white px-3 py-2 rounded-lg transition-all border border-amber-400/40 shadow-md"
                aria-label="Exit guest mode"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">Exit Guest Mode</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-white px-3 py-2 rounded-lg transition-all border border-red-400/20 shadow-md"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">Logout</span>
              </motion.button>
            )}
            
            <div className="relative" ref={dropdownRef}>
              {/* Guest Mode Indicator - Always visible when in guest mode */}
              {isGuestMode && (
                <div className="absolute -top-4 -right-2 text-xs bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full border border-amber-400/40 animate-pulse shadow-md">
                  <span className="font-bold">Guest Mode</span>
                </div>
              )}
              <button 
                onClick={() => {
                  const dropdown = document.getElementById('user-dropdown');
                  if (dropdown) {
                    dropdown.classList.toggle('hidden');
                  }
                }} 
                className="flex items-center space-x-2 bg-white/5 hover:bg-white/15 rounded-lg px-3 py-2 transition-all border border-white/10 shadow-sm"
                aria-label="Open user menu"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {isGuestMode ? 'Guest User' : `${user?.firstName} ${user?.lastName}`}
                  </p>
                  <p className="text-xs text-gray-300">
                    {isGuestMode ? 'Exploring in guest mode' : user?.email}
                  </p>
                </div>
              </button>
              
              {/* Dropdown Menu - Now controlled by click instead of hover */}
              <div id="user-dropdown" className="hidden absolute right-0 mt-2 w-56 bg-white/15 backdrop-blur-md rounded-lg shadow-xl border border-white/30 overflow-hidden transform origin-top-right transition-all z-50">
                <div className="p-3 space-y-2">
                  {/* User info header in dropdown */}
                  <div className="mb-3 pb-2 border-b border-white/10">
                    <p className="text-sm font-bold text-white">
                      {isGuestMode ? 'Guest Account' : `${user?.firstName} ${user?.lastName}`}
                    </p>
                    <p className="text-xs text-gray-300 truncate">
                      {isGuestMode ? 'Limited functionality' : user?.email}
                    </p>
                  </div>
                  
                  {/* Profile option */}
                  <motion.a
                    href="/profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Close the dropdown
                      const dropdown = document.getElementById('user-dropdown');
                      if (dropdown) {
                        dropdown.classList.add('hidden');
                      }
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-white hover:bg-purple-500/20 rounded-lg transition-all"
                    aria-label="View profile"
                  >
                    <User className="w-4 h-4 text-purple-300" />
                    <span className="text-sm font-medium">Profile</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};