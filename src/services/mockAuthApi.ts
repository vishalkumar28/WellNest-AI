// This file provides mock authentication API functions

import { User } from '../types';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'demo@wellnest.com',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: new Date().toISOString()
  }
];

// Browser-safe API service that uses mock data
export const mockAuthApi = {
  auth: {
    login: async (email: string, password: string) => {
      console.log('Mock login with:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user by email (in a real app, would check password too)
      const user = mockUsers.find(u => u.email === email);
      
      if (user) {
        // Store auth token in localStorage
        localStorage.setItem('wellnest_token', 'mock_token_' + Date.now());
        localStorage.setItem('wellnest_user', JSON.stringify(user));
        return { user };
      } else {
        throw new Error('Invalid credentials');
      }
    },
    
    register: async (email: string, password: string, firstName: string, lastName: string) => {
      console.log('Mock register with:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email,
        firstName,
        lastName,
        createdAt: new Date().toISOString()
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      
      // Store auth token in localStorage
      localStorage.setItem('wellnest_token', 'mock_token_' + Date.now());
      localStorage.setItem('wellnest_user', JSON.stringify(newUser));
      
      return { user: newUser };
    },
    
    logout: async () => {
      console.log('Mock logout');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear auth data from localStorage
      localStorage.removeItem('wellnest_token');
      localStorage.removeItem('wellnest_user');
      
      return { success: true };
    }
  }
};