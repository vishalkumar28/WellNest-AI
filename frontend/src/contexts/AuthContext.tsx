import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authApi } from '../services/authApi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('wellnest_token');
    const userData = localStorage.getItem('wellnest_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Loading user from localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('wellnest_token');
        localStorage.removeItem('wellnest_user');
      }
    } else {
      console.log('No existing session found');
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login with:', email);
      const { user } = await authApi.auth.login(email, password);
      console.log('Login successful, user:', user);
      setUser(user);
      // Ensure user data is saved to localStorage
      localStorage.setItem('wellnest_user', JSON.stringify(user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      console.log('Attempting registration with:', email);
      const { user } = await authApi.auth.register(email, password, firstName, lastName);
      console.log('Registration successful, user:', user);
      setUser(user);
      // Ensure user data is saved to localStorage
      localStorage.setItem('wellnest_user', JSON.stringify(user));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      console.log('Logging out user');
      await authApi.auth.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};