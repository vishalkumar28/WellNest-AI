import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GuestContextType {
  isGuestMode: boolean;
  guestEntries: any[];
  setGuestMode: (isGuest: boolean) => void;
  addGuestEntry: (entry: any) => void;
  clearGuestData: () => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

interface GuestProviderProps {
  children: ReactNode;
}

export const GuestProvider: React.FC<GuestProviderProps> = ({ children }) => {
  // Initialize state from localStorage if available
  const [isGuestMode, setIsGuestMode] = useState(() => {
    const savedMode = localStorage.getItem('wellnest_guest_mode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  
  const [guestEntries, setGuestEntries] = useState<any[]>(() => {
    const savedEntries = localStorage.getItem('wellnest_guest_entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('wellnest_guest_mode', JSON.stringify(isGuestMode));
  }, [isGuestMode]);
  
  useEffect(() => {
    localStorage.setItem('wellnest_guest_entries', JSON.stringify(guestEntries));
  }, [guestEntries]);

  const setGuestMode = (isGuest: boolean) => {
    setIsGuestMode(isGuest);
    localStorage.setItem('wellnest_guest_mode', JSON.stringify(isGuest));
    if (!isGuest) {
      clearGuestData();
    }
  };

  const addGuestEntry = (entry: any) => {
    const newEntry = {
      ...entry,
      id: `guest-${Date.now()}`,
      entryDate: new Date().toISOString(),
      isGuest: true
    };
    setGuestEntries(prev => [newEntry, ...prev]);
  };

  const clearGuestData = () => {
    setGuestEntries([]);
    localStorage.removeItem('wellnest_guest_entries');
  };

  const value: GuestContextType = {
    isGuestMode,
    guestEntries,
    setGuestMode,
    addGuestEntry,
    clearGuestData
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
};