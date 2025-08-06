// Isomorphic database service that works in both browser and Node.js environments
import { User, WellnessEntry, ChatMessage } from '../types';

// Detect environment
const isBrowser = typeof window !== 'undefined';

// Mock implementations for browser environment
const mockBcrypt = {
  async hash(data: string, saltRounds: number): Promise<string> {
    console.warn('Using mock bcrypt in browser environment');
    return `mock-hashed-${data}-${saltRounds}`;
  },
  async compare(data: string, hash: string): Promise<boolean> {
    console.warn('Using mock bcrypt in browser environment');
    return hash === `mock-hashed-${data}-10`; // Assuming saltRounds is 10
  }
};

// Use real or mock implementations based on environment
let bcrypt: typeof mockBcrypt;
let pool: any;

if (isBrowser) {
  // Browser environment - use mocks
  bcrypt = mockBcrypt;
  pool = {
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
} else {
  // Node.js environment - use real implementations
  try {
    // Dynamic imports to avoid browser issues
    const bcryptModule = require('bcrypt');
    const { pool: dbPool } = require('../config/database');
    
    bcrypt = bcryptModule;
    pool = dbPool;
  } catch (error) {
    console.error('Error loading Node.js modules:', error);
    // Fallback to mocks if modules can't be loaded
    bcrypt = mockBcrypt;
    pool = {
      query: async () => ({ rows: [] }),
      on: () => pool
    };
  }
}

export class IsomorphicDatabaseService {
  // User operations
  static async createUser(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, firstName, lastName, hashedPassword]
    );
    
    if (isBrowser || result.rows.length === 0) {
      // Return mock data in browser
      return {
        id: '1',
        email,
        firstName,
        lastName,
        createdAt: new Date().toISOString()
      };
    }
    
    const user = result.rows[0];
    return {
      id: user.id.toString(),
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at
    };
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (isBrowser) {
      // In browser, return mock user for demo@example.com, null for others
      if (email === 'demo@example.com') {
        return {
          id: '1',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          createdAt: new Date().toISOString()
        };
      }
      return null;
    }
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    return {
      id: user.id.toString(),
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at
    };
  }

  static async verifyUser(email: string, password: string): Promise<User | null> {
    if (isBrowser) {
      // In browser, accept any password for demo@example.com
      if (email === 'demo@example.com') {
        return {
          id: '1',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          createdAt: new Date().toISOString()
        };
      }
      return null;
    }
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return null;
    }
    
    return {
      id: user.id.toString(),
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      createdAt: user.created_at
    };
  }

  // Wellness entries operations
  static async createWellnessEntry(entry: Partial<WellnessEntry>): Promise<WellnessEntry> {
    if (isBrowser) {
      // Return mock entry in browser
      return {
        id: Math.random().toString(36).substring(2, 15),
        userId: entry.userId || '1',
        entryDate: entry.entryDate || new Date().toISOString(),
        moodRating: entry.moodRating || 5,
        energyLevel: entry.energyLevel || 5,
        sleepHours: entry.sleepHours || 7,
        sleepQuality: entry.sleepQuality || 5,
        stressLevel: entry.stressLevel || 5,
        waterIntake: entry.waterIntake || 0,
        exerciseMinutes: entry.exerciseMinutes || 0,
        notes: entry.notes || '',
        aiInsights: entry.aiInsights || ''
      };
    }
    
    const result = await pool.query(
      `INSERT INTO wellness_entries 
       (user_id, entry_date, mood_rating, energy_level, sleep_hours, sleep_quality, stress_level, water_intake, exercise_minutes, notes, ai_insights)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        entry.userId,
        entry.entryDate,
        entry.moodRating,
        entry.energyLevel,
        entry.sleepHours,
        entry.sleepQuality,
        entry.stressLevel,
        entry.waterIntake || 0,
        entry.exerciseMinutes || 0,
        entry.notes || '',
        entry.aiInsights || ''
      ]
    );
    
    const dbEntry = result.rows[0];
    return {
      id: dbEntry.id.toString(),
      userId: dbEntry.user_id.toString(),
      entryDate: dbEntry.entry_date,
      moodRating: dbEntry.mood_rating,
      energyLevel: dbEntry.energy_level,
      sleepHours: dbEntry.sleep_hours,
      sleepQuality: dbEntry.sleep_quality,
      stressLevel: dbEntry.stress_level,
      waterIntake: dbEntry.water_intake,
      exerciseMinutes: dbEntry.exercise_minutes,
      notes: dbEntry.notes,
      aiInsights: dbEntry.ai_insights
    };
  }

  static async getWellnessEntries(userId: string): Promise<WellnessEntry[]> {
    if (isBrowser) {
      // Return mock entries in browser
      return Array(5).fill(null).map((_, i) => ({
        id: (i + 1).toString(),
        userId,
        entryDate: new Date(Date.now() - i * 86400000).toISOString(), // Previous days
        moodRating: Math.floor(Math.random() * 5) + 5, // 5-10
        energyLevel: Math.floor(Math.random() * 5) + 5, // 5-10
        sleepHours: Math.floor(Math.random() * 4) + 6, // 6-10
        sleepQuality: Math.floor(Math.random() * 5) + 5, // 5-10
        stressLevel: Math.floor(Math.random() * 5) + 1, // 1-5
        waterIntake: Math.floor(Math.random() * 8) + 1, // 1-8
        exerciseMinutes: Math.floor(Math.random() * 60) + 15, // 15-75
        notes: 'Mock entry for browser environment',
        aiInsights: ''
      }));
    }
    
    const result = await pool.query(
      'SELECT * FROM wellness_entries WHERE user_id = $1 ORDER BY entry_date DESC',
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id.toString(),
      userId: row.user_id.toString(),
      entryDate: row.entry_date,
      moodRating: row.mood_rating,
      energyLevel: row.energy_level,
      sleepHours: row.sleep_hours,
      sleepQuality: row.sleep_quality,
      stressLevel: row.stress_level,
      waterIntake: row.water_intake,
      exerciseMinutes: row.exercise_minutes,
      notes: row.notes,
      aiInsights: row.ai_insights
    }));
  }

  static async getWellnessAnalytics(userId: string): Promise<any> {
    if (isBrowser) {
      // Generate mock analytics data for browser
      const mockEntries = Array(30).fill(null).map((_, i) => ({
        date: new Date(Date.now() - i * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: Math.floor(Math.random() * 5) + 5, // 5-10
        energy: Math.floor(Math.random() * 5) + 5, // 5-10
        sleep: Math.floor(Math.random() * 5) + 5, // 5-10
        stress: Math.floor(Math.random() * 5) + 5 // 5-10 (inverted)
      }));
      
      return {
        entries: mockEntries,
        summary: {
          averageMood: 7.5,
          averageEnergy: 7.2,
          averageSleep: 7.8,
          averageStress: 4.3,
          totalEntries: mockEntries.length
        }
      };
    }
    
    // Get entries for the last 30 days
    const result = await pool.query(
      `SELECT * FROM wellness_entries 
       WHERE user_id = $1 AND entry_date >= CURRENT_DATE - INTERVAL '30 days'
       ORDER BY entry_date ASC`,
      [userId]
    );
    
    const entries = result.rows;
    
    // Calculate analytics
    const analytics = {
      entries: entries.map(entry => ({
        date: new Date(entry.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: entry.mood_rating,
        energy: entry.energy_level,
        sleep: entry.sleep_quality,
        stress: 10 - entry.stress_level // Invert stress for chart
      })),
      summary: {
        averageMood: entries.length ? Math.round((entries.reduce((sum, e) => sum + e.mood_rating, 0) / entries.length) * 10) / 10 : 0,
        averageEnergy: entries.length ? Math.round((entries.reduce((sum, e) => sum + e.energy_level, 0) / entries.length) * 10) / 10 : 0,
        averageSleep: entries.length ? Math.round((entries.reduce((sum, e) => sum + e.sleep_quality, 0) / entries.length) * 10) / 10 : 0,
        averageStress: entries.length ? Math.round((entries.reduce((sum, e) => sum + e.stress_level, 0) / entries.length) * 10) / 10 : 0,
        totalEntries: entries.length
      }
    };
    
    return analytics;
  }

  // Chat messages operations
  static async createChatMessage(message: Partial<ChatMessage>): Promise<ChatMessage> {
    if (isBrowser) {
      // Return mock message in browser
      return {
        id: Math.random().toString(36).substring(2, 15),
        userId: message.userId || '1',
        content: message.content || '',
        sender: message.sender || 'user',
        timestamp: new Date().toISOString(),
        isSignInPrompt: message.isSignInPrompt
      };
    }
    
    const result = await pool.query(
      'INSERT INTO chat_messages (user_id, content, sender) VALUES ($1, $2, $3) RETURNING *',
      [message.userId, message.content, message.sender]
    );
    
    const dbMessage = result.rows[0];
    return {
      id: dbMessage.id.toString(),
      userId: dbMessage.user_id.toString(),
      content: dbMessage.content,
      sender: dbMessage.sender,
      timestamp: dbMessage.timestamp,
      isSignInPrompt: message.isSignInPrompt
    };
  }

  static async getChatHistory(userId: string): Promise<ChatMessage[]> {
    if (isBrowser) {
      // Return mock chat history in browser
      return [
        {
          id: '1',
          userId,
          content: 'Hello! How can I help you today?',
          sender: 'bot',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          userId,
          content: 'I\'m feeling a bit stressed today.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3500000).toISOString()
        },
        {
          id: '3',
          userId,
          content: 'I\'m sorry to hear that. Would you like to talk about what\'s causing your stress?',
          sender: 'bot',
          timestamp: new Date(Date.now() - 3400000).toISOString()
        }
      ];
    }
    
    const result = await pool.query(
      'SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY timestamp ASC',
      [userId]
    );
    
    return result.rows.map(row => ({
      id: row.id.toString(),
      userId: row.user_id.toString(),
      content: row.content,
      sender: row.sender,
      timestamp: row.timestamp
    }));
  }
}