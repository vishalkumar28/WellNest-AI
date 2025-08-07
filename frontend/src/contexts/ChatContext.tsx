import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage, ChatContextType } from '../types';
import { useAuth } from './AuthContext';
import { useWellness } from './WellnessContext';
import { chatApi } from '../services/chatApi'; // Chat API service

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { entries } = useWellness();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);



  // Removed unused state variables since we now support unlimited guest messages

  // Generate contextual AI responses for guest users
  const generateAIResponse = (userMessage: string, isGuest: boolean): string => {
    const message = userMessage.toLowerCase();
    
    // Health and wellness related responses
    if (message.includes('sleep') || message.includes('insomnia') || message.includes('tired')) {
      return "Getting quality sleep is crucial for your wellness! Try establishing a consistent bedtime routine, avoid screens 1 hour before bed, and create a cool, dark sleeping environment. Aim for 7-9 hours of sleep per night. Would you like tips for better sleep hygiene?";
    }
    
    if (message.includes('stress') || message.includes('anxiety') || message.includes('worried')) {
      return "Managing stress is important for your mental health. Try deep breathing exercises, meditation, or taking short breaks throughout the day. Physical activity can also help reduce stress levels. Remember, it's okay to ask for help when you need it.";
    }
    
    if (message.includes('exercise') || message.includes('workout') || message.includes('fitness')) {
      return "Great question about exercise! Aim for at least 150 minutes of moderate activity per week. Start with activities you enjoy - walking, dancing, swimming, or yoga. Even 10-minute sessions throughout the day count! What type of exercise interests you?";
    }
    
    if (message.includes('diet') || message.includes('nutrition') || message.includes('food') || message.includes('eat')) {
      return "A balanced diet is key to wellness! Focus on whole foods like fruits, vegetables, lean proteins, and whole grains. Stay hydrated by drinking plenty of water. Remember, it's about progress, not perfection. Do you have specific nutrition questions?";
    }
    
    if (message.includes('mood') || message.includes('depression') || message.includes('sad')) {
      return "Your mental health matters. If you're feeling down, try connecting with friends, getting some sunlight, or engaging in activities you enjoy. If these feelings persist, consider talking to a mental health professional. You're not alone in this journey.";
    }
    
    if (message.includes('energy') || message.includes('fatigue') || message.includes('exhausted')) {
      return "Low energy can have many causes - poor sleep, stress, or nutritional deficiencies. Try getting adequate sleep, staying hydrated, eating regular meals, and incorporating light exercise. If fatigue persists, it might be worth discussing with a healthcare provider.";
    }
    
    if (message.includes('headache') || message.includes('migraine')) {
      return "Headaches can be caused by stress, dehydration, poor posture, or lack of sleep. Try drinking water, taking breaks from screens, practicing good posture, and getting adequate rest. If headaches are severe or frequent, consult a healthcare provider.";
    }
    
    if (message.includes('back pain') || message.includes('neck pain')) {
      return "Back and neck pain are common issues. Try maintaining good posture, taking regular breaks from sitting, gentle stretching, and strengthening exercises. If pain is severe or persistent, it's best to consult a healthcare provider for proper evaluation.";
    }
    
    if (message.includes('weight') || message.includes('lose weight') || message.includes('gain weight')) {
      return "Healthy weight management involves balanced nutrition, regular exercise, and sustainable lifestyle changes. Focus on whole foods, portion control, and finding physical activities you enjoy. Remember, everyone's body is different - what works for one person may not work for another.";
    }
    
    if (message.includes('meditation') || message.includes('mindfulness')) {
      return "Meditation and mindfulness are excellent for mental wellness! Start with just 5-10 minutes daily. Focus on your breath, observe your thoughts without judgment, and be patient with yourself. There are many apps and guided sessions available to help you get started.";
    }
    
    if (message.includes('water') || message.includes('hydration')) {
      return "Staying hydrated is essential! Aim to drink 8-10 glasses of water daily, more if you're active or in hot weather. Listen to your body's thirst signals and try carrying a water bottle with you. Herbal teas and water-rich foods also contribute to hydration.";
    }
    
    if (message.includes('vitamin') || message.includes('supplement')) {
      return "While a balanced diet should provide most nutrients, some people may benefit from supplements. However, it's best to consult with a healthcare provider before starting any supplements, as they can interact with medications and may not be necessary for everyone.";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm here to help with your wellness journey. I can provide information about sleep, stress, exercise, nutrition, mental health, and more. What would you like to know about today?";
    }
    
    if (message.includes('help') || message.includes('what can you do')) {
      return "I'm your wellness assistant! I can help with questions about health, fitness, nutrition, mental wellness, sleep, stress management, and general wellness tips. Just ask me anything related to your health and wellbeing journey!";
    }
    
    // Default response
    return "I'm here to support your wellness journey! I can help with questions about health, fitness, nutrition, mental wellness, sleep, stress management, and more. Feel free to ask me anything related to your wellbeing. What's on your mind today?";
  };

  const sendMessage = async (content: string) => {
    setLoading(true);
    
    // Check if user is authenticated or in guest mode
    const isGuest = !user;
    const userId = user?.id || 'guest-user';
    
    try {
      // Create user message with local ID generation for immediate display
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: userId,
        content,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      // Add user message to state
      setMessages(prev => [...prev, userMessage]);

      // Try to get AI response for both authenticated and guest users
      let aiResponse = null;
      
      if (!isGuest) {
        // For authenticated users, try backend first
        try {
          const response = await chatApi.chat.sendMessage(content, userId);
          aiResponse = response.message.content;
        } catch (error) {
          console.error('Failed to send message to backend:', error);
          // Fall back to local AI processing for any backend errors
        }
      }
      
      // If no backend response (guest user or backend failed), use local AI processing
      if (!aiResponse) {
        // Simulate typing delay for more natural conversation
        const typingDelay = Math.floor(Math.random() * 1000) + 1500;
        await new Promise(resolve => setTimeout(resolve, typingDelay));
        
        // Generate contextual AI response based on user message
        aiResponse = generateAIResponse(content, isGuest);
      }

      // Create bot message
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: userId,
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      // Add bot message to state
      setMessages(prev => [...prev, botMessage]);
      
      // For guest users, occasionally suggest signing up (but don't block them)
      if (isGuest && Math.random() < 0.3) { // 30% chance
        const suggestionMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          userId: userId,
          content: "💡 Tip: Sign up to save your chat history and get personalized wellness insights!",
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isSuggestion: true
        };
        setMessages(prev => [...prev, suggestionMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Create error message with local ID generation
      const fallbackErrorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        userId: userId,
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, fallbackErrorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  // Load chat history when user logs in or show welcome message for guests
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user && user.id) {
        try {
          setLoading(true);
          const response = await chatApi.chat.getHistory(user.id);
          if (response && response.messages) {
            setMessages(response.messages);
          }
        } catch (error) {
          console.error('Failed to load chat history:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Show welcome message for guest users
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          userId: 'guest-user',
          content: "👋 Hello! I'm your AI wellness assistant. I can help you with questions about health, fitness, nutrition, mental wellness, sleep, stress management, and more. Feel free to ask me anything! 💚",
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
      }
    };
    
    loadChatHistory();
  }, [user]);

  const value: ChatContextType = {
    messages,
    sendMessage,
    loading
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};