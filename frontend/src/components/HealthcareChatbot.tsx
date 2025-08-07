import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Mic, 
  MicOff, 
  User,
  MessageCircle 
} from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import { useAppContext } from '../contexts/AppContext';
import { useAccessibility } from '../hooks/useAccessibility';

export const HealthcareChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage, loading } = useChat();
  const { theme } = useAppContext();
  const { announceToScreenReader, reducedMotion } = useAccessibility();

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      sendMessage(inputValue.trim());
      setInputValue('');
      announceToScreenReader('Message sent');
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      announceToScreenReader('Voice input activated');
      // Simulate voice input
      setTimeout(() => {
        setInputValue('Hello, I need some wellness advice');
        setIsListening(false);
      }, 2000);
    } else {
      announceToScreenReader('Voice input deactivated');
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <motion.button
          onClick={() => {
            setIsOpen(true);
            announceToScreenReader('Chat opened');
            // Focus on input when chat is opened
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '56px' : '600px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            {/* Header */}
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Human-like avatar for therapist */}
                  <motion.div 
                    className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
                    animate={{ 
                      scale: reducedMotion ? 1 : [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: reducedMotion ? 0 : Infinity,
                      repeatDelay: 1
                    }}
                  >
                    {/* Use User icon or initials */}
                    <User className="w-5 h-5 text-blue-700" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold">AI Therapist</h3>
                    <p className="text-xs opacity-90">
                      {loading ? 'Bot is typing...' : 'Online'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => {
                      setIsMinimized(!isMinimized);
                      announceToScreenReader(isMinimized ? 'Chat expanded' : 'Chat minimized');
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                    aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setIsOpen(false);
                      announceToScreenReader('Chat closed');
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Chat content */}
            {!isMinimized && (
              <>
                <motion.div 
                  className="flex-1 overflow-y-auto p-4 h-[calc(600px-128px)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <AnimatePresence>
                    {messages.map((message, index) => {
                      const isUser = message.sender === 'user';
                      
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
                          className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <motion.div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative group ${
                              isUser 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            {/* Message content */}
                            <div className="flex items-start space-x-2">
                              {!isUser && (
                                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                  <User className="w-3 h-3 text-white" />
                                </div>
                              )}
                              
                              <div className="flex-1">
                              <p className={`text-sm leading-relaxed ${message.isSuggestion ? 'text-blue-600 font-medium' : ''}`}>
                                {message.content}
                              </p>
                              {message.isSignInPrompt && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium"
                                  onClick={() => window.location.href = '/?auth=true'}
                                >
                                  Sign In / Register
                                </motion.button>
                              )}
                              {message.isSuggestion && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium border border-blue-200"
                                  onClick={() => window.location.href = '/?auth=true'}
                                >
                                  Sign Up
                                </motion.button>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-70">
                                  {formatTime(message.timestamp)}
                                </span>
                                </div>
                              </div>
                              
                              {isUser && (
                                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                  <User className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </div>
                          </motion.div>
                      </motion.div>
                      );
                    })}
                  </AnimatePresence>
                    
                  {/* Typing indicator */}
                  <AnimatePresence>
                    {typingIndicator && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                          <div className="flex items-center space-x-1">
                            <motion.div 
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                    <div ref={messagesEndRef} />
                </motion.div>

                {/* Input */}
                <motion.div 
                  className="p-4 border-t border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
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
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </motion.button>
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={!inputValue.trim() || loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-full transition-all ${
                        inputValue.trim() && !loading
                          ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </form>
                </motion.div>
              </>
              )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};