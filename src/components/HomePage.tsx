import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Moon, Brain, Activity, Shield, Users, TrendingUp, Target, MessageSquare, Sparkles } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const HomePage: React.FC = () => {
  const { setActiveTab } = useAppContext();
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
    <div className="px-4 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">WellNest</span>
        </h1>
        <p className="text-xl text-pink-100 max-w-3xl mx-auto">
          Your comprehensive wellness tracking platform. Monitor your mood, energy, sleep, and stress with AI-powered insights.
        </p>
      </motion.div>

      {/* Features Section */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Comprehensive Wellness Tracking
          </h2>
          <p className="text-lg text-pink-100">
            Everything you need to monitor and improve your well-being
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
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
      </section>

      {/* Benefits Section */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Choose WellNest?
          </h2>
          <p className="text-lg text-pink-100">
            Join thousands of users improving their wellness journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) + 0.4 }}
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
      </section>

      {/* AI Chat Feature Block */}
      <section className="mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center mb-2">
                <h2 className="text-2xl font-bold text-white mr-2">Talk to AI Assistant</h2>
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              
              <p className="text-pink-100 mb-4">
                Feeling overwhelmed? Our AI assistant is here to help. Get personalized support, coping strategies, and evidence-based advice to reduce stress and anxiety. Your wellness companion is just a conversation away.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('chat')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Start Chatting</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer Section with Links */}
      <section className="mt-16 pt-8 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex flex-col md:flex-row justify-between items-center"
        >
          <div className="mb-4 md:mb-0">
            <p className="text-pink-100 text-sm">
              © {new Date().getFullYear()} WellNest. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(`${window.location.origin}?tab=privacy`, '_blank');
              }}
              className="text-pink-100 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(`${window.location.origin}?tab=terms`, '_blank');
              }}
              className="text-pink-100 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(`${window.location.origin}?tab=contact`, '_blank');
              }}
              className="text-pink-100 hover:text-white text-sm transition-colors"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;