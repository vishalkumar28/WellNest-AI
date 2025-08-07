import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  User, 
  Search,
  Bookmark,
  RotateCcw,
  Mic,
  MicOff,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Plus,
  Trash2
} from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAccessibility } from '../hooks/useAccessibility';
import { useWellness } from '../contexts/WellnessContext';

interface QuickReply {
  id: string;
  text: string;
  category: 'mood' | 'sleep' | 'stress' | 'exercise' | 'general';
}

const quickReplies: QuickReply[] = [
  { id: '1', text: 'I\'m feeling stressed today', category: 'stress' },
  { id: '2', text: 'How can I improve my sleep?', category: 'sleep' },
  { id: '3', text: 'I need motivation for exercise', category: 'exercise' },
  { id: '4', text: 'My mood has been low lately', category: 'mood' },
  { id: '5', text: 'What wellness tips do you have?', category: 'general' },
  { id: '6', text: 'Help me set wellness goals', category: 'general' }
];

export const NewChatPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messageReactions, setMessageReactions] = useState<Record<string, 'up' | 'down' | null>>({});
  const [bookmarkedMessages, setBookmarkedMessages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage, loading } = useChat();
  const { announceToScreenReader, reducedMotion } = useAccessibility();
  const { entries } = useWellness();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (loading) {
      setTypingIndicator(true);
      const timer = setTimeout(() => setTypingIndicator(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;
    
    try {
      await sendMessage(inputValue);
      setInputValue('');
      setShowQuickReplies(false);
      announceToScreenReader('Message sent');
    } catch (error) {
      console.error('Failed to send message:', error);
      announceToScreenReader('Failed to send message');
    }
  };

  const handleQuickReply = async (reply: QuickReply) => {
    try {
      await sendMessage(reply.text);
      setShowQuickReplies(false);
      announceToScreenReader(`Quick reply sent: ${reply.text}`);
    } catch (error) {
      console.error('Failed to send quick reply:', error);
      announceToScreenReader('Failed to send quick reply');
    }
  };

  const toggleVoiceInput = () => {
    // Voice input functionality would be implemented here
    setIsListening(prev => !prev);
    announceToScreenReader(isListening ? 'Voice input stopped' : 'Voice input started');
  };

  const toggleBookmark = (messageId: string) => {
    setBookmarkedMessages(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(messageId)) {
        newBookmarks.delete(messageId);
        announceToScreenReader('Message bookmark removed');
      } else {
        newBookmarks.add(messageId);
        announceToScreenReader('Message bookmarked');
      }
      return newBookmarks;
    });
  };

  const handleReaction = (messageId: string, reaction: 'up' | 'down') => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: prev[messageId] === reaction ? null : reaction
    }));
    announceToScreenReader(`${reaction === 'up' ? 'Liked' : 'Disliked'} message`);
  };

  const regenerateResponse = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.sender === 'bot') {
      announceToScreenReader('Regenerating response');
      try {
        await sendMessage(`Regenerate: ${message.content}`);
      } catch (error) {
        console.error('Failed to regenerate response:', error);
        announceToScreenReader('Failed to regenerate response');
      }
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const startNewChat = () => {
    // Clear messages for a new chat
    setMessages([]);
    setShowQuickReplies(true);
  };

  const filteredMessages = isSearching && searchQuery
    ? messages.filter(msg => 
        msg.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const getMessageContext = () => {
    // Analyze user's wellness data for context-aware responses
    const recentEntries = entries.slice(0, 7);
    const avgMood = recentEntries.length > 0 ? recentEntries.reduce((sum, entry) => sum + entry.moodRating, 0) / recentEntries.length : 0;
    const avgStress = recentEntries.length > 0 ? recentEntries.reduce((sum, entry) => sum + entry.stressLevel, 0) / recentEntries.length : 0;
    
    return {
      avgMood,
      avgStress,
      hasRecentData: recentEntries.length > 0,
      trend: avgMood > 7 ? 'positive' : avgMood < 5 ? 'negative' : 'neutral'
    };
  };

  return (
    <div className="flex h-full bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* AI Avatar */}
              <motion.div 
                className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                animate={{ 
                  scale: reducedMotion ? 1 : [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: reducedMotion ? 0 : Infinity,
                  repeatDelay: 1
                }}
              >
                <User className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h3 className="font-semibold text-xl">WellNest AI</h3>
                <p className="text-sm opacity-90">
                  {loading ? 'Assistant is typing...' : 'Online'}
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(e.target.value.length > 0);
                }}
                placeholder="Search messages..."
                className="px-3 py-1 text-sm bg-white/20 border border-white/30 rounded-full text-white placeholder-white/70 w-40 focus:w-56 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
            </div>
          </div>
        </div>

        {/* Messages - This container will be scrollable while the rest of the page remains fixed */}
        <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-transparent to-black/5" style={{ height: 'calc(100vh - 200px)', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          <AnimatePresence>
            {filteredMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Welcome to Your WellNest AI Wellness Assistant</h3>
                <p className="text-gray-200 mb-6">
                  I'm here to help with your wellness journey. Ask me anything about stress management, sleep, mood, or general wellness.
                </p>
                <p className="text-gray-300 text-sm">
                  I can search for information and provide evidence-based advice tailored to your needs.
                </p>
              </motion.div>
            ) : (
              filteredMessages.map((message, index) => {
                const isUser = message.sender === 'user';
                const context = getMessageContext();
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.3
                    }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <motion.div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative group ${
                        isUser 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'bg-white/20 backdrop-blur-sm text-white border border-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                    >
                      {/* Message content */}
                      <div className="flex items-start space-x-2">
                        {!isUser && (
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-3 h-3 text-white" />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                            
                            {/* Message actions */}
                            <AnimatePresence>
                              {selectedMessage === message.id && (
                                <motion.div
                                  className="flex items-center space-x-1"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {!isUser && (
                                    <motion.button
                                      onClick={() => regenerateResponse(message.id)}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="p-1 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors"
                                      aria-label="Regenerate response"
                                    >
                                      <RotateCcw className="w-3 h-3 text-white" />
                                    </motion.button>
                                  )}
                                  
                                  <motion.button
                                    onClick={() => toggleBookmark(message.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-1 rounded-full transition-colors ${
                                      bookmarkedMessages.has(message.id)
                                        ? 'text-yellow-500'
                                        : 'hover:bg-black hover:bg-opacity-10 text-white'
                                    }`}
                                    aria-label={bookmarkedMessages.has(message.id) ? 'Remove bookmark' : 'Bookmark message'}
                                  >
                                    <Bookmark className="w-3 h-3" />
                                  </motion.button>
                                  
                                  <motion.button
                                    onClick={() => handleReaction(message.id, 'up')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-1 rounded-full transition-colors ${
                                      messageReactions[message.id] === 'up' 
                                        ? 'text-green-500'
                                        : 'hover:bg-black hover:bg-opacity-10 text-white'
                                    }`}
                                    aria-label="Like message"
                                  >
                                    <ThumbsUp className="w-3 h-3" />
                                  </motion.button>
                                  
                                  <motion.button
                                    onClick={() => handleReaction(message.id, 'down')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`p-1 rounded-full transition-colors ${
                                      messageReactions[message.id] === 'down' 
                                        ? 'text-red-500'
                                        : 'hover:bg-black hover:bg-opacity-10 text-white'
                                    }`}
                                    aria-label="Dislike message"
                                  >
                                    <ThumbsDown className="w-3 h-3" />
                                  </motion.button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          
                          {/* Context info for bot messages */}
                          {!isUser && context.hasRecentData && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.7 }}
                              className="mt-1 text-xs text-white/70"
                            >
                              <span>
                                Based on your recent data (Avg mood: {context.avgMood.toFixed(1)}/10)
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
          
          {/* Typing indicator */}
          <AnimatePresence>
            {typingIndicator && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-white/20 backdrop-blur-sm text-white border border-white/10 px-4 py-3 rounded-2xl max-w-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.2 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.3, delay: 0.1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.4, delay: 0.2 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <AnimatePresence>
          {showQuickReplies && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-white/10 bg-white/5"
            >
              <h4 className="text-sm font-medium text-white mb-3">Quick replies:</h4>
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map((reply) => (
                  <motion.button
                    key={reply.id}
                    onClick={() => handleQuickReply(reply)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-xs p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-left text-white"
                  >
                    {reply.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-white placeholder-white/70"
                disabled={loading}
              />
              
              {/* Voice input button */}
              <motion.button
                type="button"
                onClick={toggleVoiceInput}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : 'text-white/70 hover:text-white'
                }`}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </motion.button>
            </div>
            
            <motion.button
              type="submit"
              disabled={!inputValue.trim() || loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};