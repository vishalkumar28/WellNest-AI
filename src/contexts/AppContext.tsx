import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TabType = 'home' | 'checkin' | 'dashboard' | 'chat' | 'profile' | 'privacy' | 'terms' | 'contact';

interface AppContextType {
  theme: string;
  setTheme: (theme: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  activeTab?: TabType;
  setActiveTab?: (tab: TabType) => void;
}

const defaultAppContext: AppContextType = {
  theme: 'light',
  setTheme: () => {},
  language: 'en',
  setLanguage: () => {}
};

export const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');
  const [language, setLanguage] = useState<string>('en');
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const value = {
    theme,
    setTheme,
    language,
    setLanguage,
    activeTab,
    setActiveTab
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};