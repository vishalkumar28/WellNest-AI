// Shared utility functions between frontend and backend

// Example of a shared utility function
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Add more shared utility functions as needed