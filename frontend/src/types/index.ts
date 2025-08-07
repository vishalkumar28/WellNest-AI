export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface WellnessEntry {
  id: string;
  userId: string;
  entryDate: string;
  moodRating: number;
  energyLevel: number;
  sleepHours: number;
  sleepQuality: number;
  stressLevel: number;
  waterIntake?: number;
  exerciseMinutes?: number;
  notes?: string;
  aiInsights?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isSignInPrompt?: boolean;
  isSuggestion?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface WellnessContextType {
  entries: WellnessEntry[];
  currentEntry: Partial<WellnessEntry>;
  updateCurrentEntry: (data: Partial<WellnessEntry>) => void;
  submitEntry: () => Promise<void>;
  getAnalytics: () => Promise<any>;
  loading: boolean;
}

export interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (content: string) => Promise<void>;
  loading: boolean;
}