// Import the appropriate database configuration based on environment
import { pool } from '../config/browserDatabase';
import * as bcrypt from 'bcrypt';
import { User, WellnessEntry, ChatMessage } from '../types';

export class DatabaseService {
  // User operations
  static async createUser(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (email, first_name, last_name, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, firstName, lastName, hashedPassword]
    );
    
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
      timestamp: dbMessage.timestamp
    };
  }

  static async getChatHistory(userId: string): Promise<ChatMessage[]> {
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