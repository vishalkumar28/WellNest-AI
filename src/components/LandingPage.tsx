import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Zap, Moon, Brain, Activity, ArrowRight, Star, Users, TrendingUp, Shield, Sparkles, Play, BookOpen, Target, Award, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGuest } from '../contexts/GuestContext';

interface LandingPageProps {
  onGuestMode: () => void;
  onSignIn: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGuestMode, onSignIn }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { user } = useAuth();
  const { isGuestMode } = useGuest();
  
  // Function to navigate to the app
  const navigateToApp = () => {
    window.location.href = '/?app=true';
  };

  const features = [
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Track your daily mood and emotional well-being with intuitive sliders and visual feedback.",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: Zap,
      title: "Energy Monitoring",
      description: "Monitor your energy levels throughout the day and identify patterns that affect your vitality.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Moon,
      title: "Sleep Analysis",
      description: "Track sleep quality and duration to improve your rest and recovery patterns.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Brain,
      title: "Stress Management",
      description: "Monitor stress levels and get personalized recommendations for stress reduction.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Activity,
      title: "Activity Tracking with AI Insights",

      description: "Log your physical activity and exercise to maintain a balanced wellness routine.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Visualize your wellness journey with beautiful charts and insights"
    },
    {
      icon: Target,
      title: "Set Goals",
      description: "Create personalized wellness goals and track your achievements"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar wellness journeys"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is secure and private - you control your information"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Simple dot pattern overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-1/3 w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-20 blur-xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="relative z-20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">WellNest</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={navigateToApp}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Go to App</span>
                </motion.button>
              ) : isGuestMode ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={navigateToApp}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Continue as Guest</span>
                </motion.button>
              ) : (
                <>
                  <button
                    onClick={onSignIn}
                    className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-pink-100 transition-all"
                  >
                    Sign In
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Your Wellness Journey
                <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-pink-100 mb-8 leading-relaxed">
                Track your mood, energy, sleep, and stress with AI-powered insights. 
                <br />
                Discover patterns, set goals, and improve your overall well-being.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                {user ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={navigateToApp}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center space-x-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : isGuestMode ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={navigateToApp}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all flex items-center space-x-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Continue as Guest</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onSignIn}
                      className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-50 transition-all flex items-center space-x-2"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-white/10 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Comprehensive Wellness Tracking
              </h2>
              <p className="text-xl text-pink-100">
                Everything you need to monitor and improve your well-being
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-pink-100 leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose WellNest?
              </h2>
              <p className="text-xl text-pink-100">
                Join thousands of users improving their wellness journey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                    <p className="text-pink-100">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Transform Your Wellness?
              </h2>
              <p className="text-xl text-pink-100 mb-8">
                Start tracking your wellness journey today and discover insights that will change your life.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                {user ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={navigateToApp}
                    className="bg-purple-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-800 transition-all flex items-center space-x-2 border-2 border-white"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                  </motion.button>
                ) : isGuestMode ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={navigateToApp}
                    className="bg-purple-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-800 transition-all flex items-center space-x-2 border-2 border-white"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Continue as Guest</span>
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onSignIn}
                      className="bg-purple-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-800 transition-all flex items-center space-x-2 border-2 border-white"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">WellNest</span>
            </div>
            <p className="text-pink-100 mb-4">
              Your comprehensive wellness tracking companion
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-pink-200">
              <button 
                onClick={() => {
                  // Navigate to privacy policy page
                  onSignIn();
                  setTimeout(() => {
                    const event = new CustomEvent('navigate', { detail: { tab: 'privacy' } });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="hover:text-white hover:underline transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => {
                  // Navigate to terms of service page
                  onSignIn();
                  setTimeout(() => {
                    const event = new CustomEvent('navigate', { detail: { tab: 'terms' } });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="hover:text-white hover:underline transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => {
                  // Navigate to contact us page
                  onSignIn();
                  setTimeout(() => {
                    const event = new CustomEvent('navigate', { detail: { tab: 'contact' } });
                    window.dispatchEvent(event);
                  }, 100);
                }}
                className="hover:text-white hover:underline transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};