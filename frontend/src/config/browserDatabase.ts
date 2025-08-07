// Browser-compatible database configuration
// This file provides a mock implementation for browser environments

export const pool = {
  query: async (text: string, params?: any[]) => {
    console.warn('Database operations are not supported in browser environment');
    console.warn('Query attempted:', text, params);
    
    // Return empty result to prevent errors
    return { rows: [] };
  },
  on: (event: string, callback: Function) => {
    if (event === 'connect') {
      console.log('Mock database connection established for browser');
    }
    return pool;
  }
};