// Real authentication API service that connects to the backend

import { User } from '../types';
import axios from 'axios';

// API base URL - using relative path for proxy
const API_URL = '/api';

export const authApi = {
  auth: {
    login: async (email: string, password: string) => {
      console.log('Attempting login with backend for:', email);
      
      try {
        // Call backend login API
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password
        });
        
        const { user, token } = response.data;
        console.log('Login successful for user:', user);
        
        // Store auth token and user data in localStorage
        localStorage.setItem('wellnest_token', token);
        localStorage.setItem('wellnest_user', JSON.stringify(user));
        
        return { user };
      } catch (error) {
        console.error('Login error with backend:', error);
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    },
    
    register: async (email: string, password: string, firstName: string, lastName: string) => {
      console.log('Attempting registration with backend for:', email);
      
      try {
        // Call backend register API
        const response = await axios.post(`${API_URL}/auth/register`, {
          email,
          password,
          firstName,
          lastName
        });
        
        const { user, token } = response.data;
        console.log('Registration successful for user:', user);
        
        // Store auth token and user data in localStorage
        localStorage.setItem('wellnest_token', token);
        localStorage.setItem('wellnest_user', JSON.stringify(user));
        
        return { user };
      } catch (error) {
        console.error('Registration error with backend:', error);
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
    },
    
    logout: async () => {
      console.log('Logging out user');
      
      // Clear auth data from localStorage
      localStorage.removeItem('wellnest_token');
      localStorage.removeItem('wellnest_user');
      
      return { success: true };
    },
    
    getProfile: async () => {
      console.log('Getting user profile from backend');
      
      try {
        const token = localStorage.getItem('wellnest_token');
        
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        // Call backend profile API
        const response = await axios.get(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        return response.data;
      } catch (error) {
        console.error('Get profile error with backend:', error);
        throw new Error(error.response?.data?.message || 'Failed to get profile');
      }
    }
  }
};