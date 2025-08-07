import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WellnessEntry, WellnessContextType } from '../types';
import { wellnessApi } from '../services/wellnessApi';
import { useAuth } from './AuthContext';

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const useWellness = () => {
  const context = useContext(WellnessContext);
  if (context === undefined) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};

interface WellnessProviderProps {
  children: ReactNode;
}

export const WellnessProvider: React.FC<WellnessProviderProps> = ({ children }) => {
  const { user } = useAuth();
  // Initialize state from localStorage if available
  const [entries, setEntries] = useState<WellnessEntry[]>(() => {
    const savedEntries = localStorage.getItem('wellnest_entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  const [currentEntry, setCurrentEntry] = useState<Partial<WellnessEntry>>(() => {
    const savedCurrentEntry = localStorage.getItem('wellnest_current_entry');
    return savedCurrentEntry ? JSON.parse(savedCurrentEntry) : {};
  });
  
  const [loading, setLoading] = useState(false);
  
  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wellnest_entries', JSON.stringify(entries));
  }, [entries]);
  
  // Save current entry to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wellnest_current_entry', JSON.stringify(currentEntry));
  }, [currentEntry]);

  console.log('WellnessProvider: Rendered with user:', user ? { id: user.id, email: user.email } : null);

  const updateCurrentEntry = (data: Partial<WellnessEntry>) => {
    const updatedEntry = { ...currentEntry, ...data };
    setCurrentEntry(updatedEntry);
    localStorage.setItem('wellnest_current_entry', JSON.stringify(updatedEntry));
  };

  const submitEntry = async () => {
    if (!user) {
      console.error('User not authenticated for entry submission');
      throw new Error('User not authenticated');
    }
    
    setLoading(true);
    try {
      console.log('Submitting wellness entry for user:', user.id);
      
      // Check if we have a valid token
      const token = localStorage.getItem('wellnest_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Validate that we have the required fields
      if (!currentEntry.moodRating || !currentEntry.energyLevel || !currentEntry.sleepQuality || !currentEntry.stressLevel) {
        throw new Error('Please complete all wellness fields before submitting');
      }
      
      // Prepare the entry data with current date
      const entryData = {
        moodRating: currentEntry.moodRating,
        energyLevel: currentEntry.energyLevel,
        sleepHours: currentEntry.sleepHours || 7,
        sleepQuality: currentEntry.sleepQuality,
        stressLevel: currentEntry.stressLevel,
        waterIntake: currentEntry.waterIntake,
        exerciseMinutes: currentEntry.exerciseMinutes,
        notes: currentEntry.notes,
        entryDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      };
      
      console.log('Submitting entry data:', entryData);
      
      // Try to submit to backend, but don't fail if backend is unavailable
      try {
        const response = await wellnessApi.wellness.submitEntry(entryData);
        const newEntry = response.entry;
        console.log('Entry submitted successfully to backend:', newEntry);
        
        // Add to local state
        setEntries(prev => [newEntry, ...prev]);
        
        // Clear current entry
        setCurrentEntry({});
        localStorage.removeItem('wellnest_current_entry');
        
        return newEntry;
      } catch (backendError) {
        console.error('Backend submission failed:', backendError);
        
        // Log detailed error information
        if (backendError.response) {
          console.error('Error response:', backendError.response.data);
          console.error('Error status:', backendError.response.status);
        }
        
        // If backend fails, save locally as fallback
        const localEntry: WellnessEntry = {
          id: `local_${Date.now()}`,
          userId: user.id,
          entryDate: entryData.entryDate,
          moodRating: entryData.moodRating || 5,
          energyLevel: entryData.energyLevel || 5,
          sleepHours: entryData.sleepHours || 7,
          sleepQuality: entryData.sleepQuality || 5,
          stressLevel: entryData.stressLevel || 5,
          waterIntake: entryData.waterIntake,
          exerciseMinutes: entryData.exerciseMinutes,
          notes: entryData.notes,
          aiInsights: entryData.aiInsights,
          createdAt: new Date().toISOString()
        };
        
        console.log('Saving entry locally as fallback:', localEntry);
        
        // Add to local state
        setEntries(prev => [localEntry, ...prev]);
        
        // Clear current entry
        setCurrentEntry({});
        localStorage.removeItem('wellnest_current_entry');
        
        // Return the local entry but indicate backend failed
        const errorMessage = backendError.response?.data?.message || backendError.message;
        throw new Error(`Data saved locally. Backend error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error submitting entry:', error);
      
      // If it's an authentication error, throw it so the UI can handle it
      if (error.message.includes('Authentication') || error.message.includes('Not authenticated')) {
        throw new Error('Authentication required. Please log in to save your data.');
      }
      
      // For other errors, provide a more specific message
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAnalytics = async () => {
    console.log('WellnessProvider: getAnalytics called with user:', user);
    
    if (!user) {
      console.error('User not authenticated for analytics');
      throw new Error('User not authenticated');
    }
    
    try {
      console.log('Fetching analytics for user:', user.id);
      const analytics = await wellnessApi.wellness.getAnalytics(user.id);
      console.log('Analytics fetched successfully:', analytics);
      return analytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  };

  const value: WellnessContextType = {
    entries,
    currentEntry,
    updateCurrentEntry,
    submitEntry,
    getAnalytics,
    loading
  };

  console.log('WellnessProvider: Providing context value:', {
    entriesCount: entries.length,
    hasGetAnalytics: !!getAnalytics,
    loading
  });

  return (
    <WellnessContext.Provider value={value}>
      {children}
    </WellnessContext.Provider>
  );
};