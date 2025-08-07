import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Settings, Shield, CheckSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGuest } from '../contexts/GuestContext';
import { useAppContext } from '../contexts/AppContext';
import { useWellness } from '../contexts/WellnessContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { isGuestMode } = useGuest();
  const { theme } = useAppContext();
  const { entries } = useWellness();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Function to handle task click
  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId === selectedTaskId ? null : taskId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Avatar */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isGuestMode ? 'Guest User' : `${user?.firstName} ${user?.lastName}`}
            </h1>
            <p className="text-gray-300 mb-6">
              {isGuestMode ? 'Exploring in guest mode' : user?.email}
            </p>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-300" />
                <span className="text-white">
                  {isGuestMode ? 'No email available' : user?.email}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-300" />
                <span className="text-white">
                  {isGuestMode ? 'Joined today' : 'Member since June 2023'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-purple-300" />
                <span className="text-white">
                  Theme: {theme || 'Default'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-purple-300" />
                <span className="text-white">
                  {isGuestMode ? 'Guest Account' : 'Standard Account'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
          {isGuestMode ? (
            <div className="w-full bg-amber-500/10 border border-amber-400/20 rounded-lg p-4 text-center">
              <h3 className="text-amber-300 font-bold mb-2">Guest Mode Active</h3>
              <p className="text-white/80 mb-4">You're currently using WellNest in guest mode with limited functionality.</p>
              <p className="text-amber-200 text-sm">Please use the logout button in the navigation bar to exit guest mode.</p>
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-colors"
              >
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-transparent border border-purple-400 text-purple-300 hover:bg-purple-500/20 rounded-lg shadow-md transition-colors"
              >
                Change Password
              </motion.button>
            </>
          )}
        </div>
        
        {/* Recent Wellness Entries (Tasks) */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <CheckSquare className="w-6 h-6 mr-2 text-purple-300" />
            Recent Wellness Entries
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            {entries && entries.length > 0 ? (
              <div className="space-y-3">
                {entries.slice(0, 5).map((entry) => (
                  <motion.div
                    key={entry.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${selectedTaskId === entry.id ? 'bg-purple-500/30 border-purple-400/50 border' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
                    onClick={() => handleTaskClick(entry.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-white">{new Date(entry.entryDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                        <div className="text-sm text-gray-300 mt-1">
                          Mood: {entry.moodRating}/10 • Energy: {entry.energyLevel}/10 • Sleep: {entry.sleepHours}h
                        </div>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTaskId === entry.id ? 'bg-purple-400/30' : 'bg-white/10'}`}>
                        <CheckSquare className={`w-5 h-5 ${selectedTaskId === entry.id ? 'text-purple-300' : 'text-gray-400'}`} />
                      </div>
                    </div>
                    
                    {/* Expanded view when selected */}
                    {selectedTaskId === entry.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white/5 p-3 rounded-lg">
                            <div className="text-sm text-gray-400">Mood</div>
                            <div className="text-xl font-medium text-white">{entry.moodRating}/10</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg">
                            <div className="text-sm text-gray-400">Energy</div>
                            <div className="text-xl font-medium text-white">{entry.energyLevel}/10</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg">
                            <div className="text-sm text-gray-400">Sleep</div>
                            <div className="text-xl font-medium text-white">{entry.sleepHours} hours</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-lg">
                            <div className="text-sm text-gray-400">Stress</div>
                            <div className="text-xl font-medium text-white">{entry.stressLevel}/10</div>
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <div className="bg-white/5 p-3 rounded-lg mb-4">
                            <div className="text-sm text-gray-400 mb-1">Notes</div>
                            <div className="text-white">{entry.notes}</div>
                          </div>
                        )}
                        
                        {entry.aiInsights && (
                          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3 rounded-lg border border-purple-400/30">
                            <div className="text-sm text-purple-300 mb-1">AI Insights</div>
                            <div className="text-white">{entry.aiInsights}</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No entries yet</h3>
                <p className="text-gray-400">
                  {isGuestMode 
                    ? 'Complete your first wellness check-in to see your entries here.'
                    : 'Start tracking your wellness to see your entries here.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;