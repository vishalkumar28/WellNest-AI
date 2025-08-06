// This file provides mock wellness API functions

import { WellnessEntry } from '../types';

// Mock wellness entries data
const mockWellnessEntries: Record<string, WellnessEntry[]> = {
  '1': [
    {
      id: '1',
      userId: '1',
      entryDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      moodRating: 7,
      energyLevel: 8,
      sleepHours: 7.5,
      sleepQuality: 8,
      stressLevel: 4,
      waterIntake: 8,
      exerciseMinutes: 45,
      aiInsights: 'Great balance today! Your mood and energy levels are well-aligned with your sleep quality.'
    },
    {
      id: '2',
      userId: '1',
      entryDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      moodRating: 6,
      energyLevel: 6,
      sleepHours: 6,
      sleepQuality: 5,
      stressLevel: 7,
      waterIntake: 6,
      exerciseMinutes: 20,
      aiInsights: 'Consider prioritizing sleep - it appears to be affecting your energy and stress levels.'
    }
  ]
};

// Browser-safe API service that uses mock data
export const mockWellnessApi = {
  wellness: {
    submitEntry: async (entryData: Partial<WellnessEntry>) => {
      console.log('Mock submitting wellness entry:', entryData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const userId = entryData.userId || '1';
      
      // Create new entry with generated ID
      const newEntry: WellnessEntry = {
        id: Date.now().toString(),
        userId,
        entryDate: entryData.entryDate || new Date().toISOString().split('T')[0],
        moodRating: entryData.moodRating || 5,
        energyLevel: entryData.energyLevel || 5,
        sleepHours: entryData.sleepHours || 7,
        sleepQuality: entryData.sleepQuality || 5,
        stressLevel: entryData.stressLevel || 5,
        waterIntake: entryData.waterIntake || 5,
        exerciseMinutes: entryData.exerciseMinutes || 0,
        notes: entryData.notes || '',
        aiInsights: generateMockInsights(entryData)
      };
      
      // Initialize user entries array if it doesn't exist
      if (!mockWellnessEntries[userId]) {
        mockWellnessEntries[userId] = [];
      }
      
      // Add to mock database
      mockWellnessEntries[userId].unshift(newEntry);
      
      return newEntry;
    },
    
    getEntries: async (userId: string) => {
      console.log('Mock getting wellness entries for user:', userId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockWellnessEntries[userId] || [];
    },
    
    getAnalytics: async (userId: string) => {
      console.log('Mock getting wellness analytics for user:', userId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const entries = mockWellnessEntries[userId] || [];
      
      // Calculate mock analytics
      return {
        averageMood: calculateAverage(entries.map(e => e.moodRating)),
        averageEnergy: calculateAverage(entries.map(e => e.energyLevel)),
        averageSleep: calculateAverage(entries.map(e => e.sleepHours)),
        averageStress: calculateAverage(entries.map(e => e.stressLevel)),
        trendData: generateMockTrendData(entries),
        insights: 'Your wellness metrics show improvement over time. Keep up the good work!'
      };
    }
  }
};

// Helper function to calculate average
function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return parseFloat((sum / values.length).toFixed(1));
}

// Helper function to generate mock insights
function generateMockInsights(entry: Partial<WellnessEntry>): string {
  const insights = [
    'Your mood and energy levels are well-balanced today.',
    'Consider increasing your water intake to improve energy levels.',
    'Your sleep quality appears to be affecting your mood positively.',
    'Try to reduce stress through mindfulness or light exercise.',
    'Great job on maintaining consistent exercise habits!',
    'Your wellness metrics are trending in a positive direction.'
  ];
  
  return insights[Math.floor(Math.random() * insights.length)];
}

// Helper function to generate mock trend data
function generateMockTrendData(entries: WellnessEntry[]) {
  // Generate last 7 days of data
  const days = 7;
  const result = [];
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Find entry for this date or generate mock data
    const entry = entries.find(e => e.entryDate === dateStr);
    
    result.unshift({
      date: dateStr,
      mood: entry?.moodRating || Math.floor(Math.random() * 5) + 5,
      energy: entry?.energyLevel || Math.floor(Math.random() * 5) + 4,
      sleep: entry?.sleepHours || Math.floor(Math.random() * 3) + 6,
      stress: entry?.stressLevel || Math.floor(Math.random() * 5) + 3
    });
  }
  
  return result;
}