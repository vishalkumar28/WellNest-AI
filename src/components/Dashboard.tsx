import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap, Moon, Brain, TrendingUp, TrendingDown, Minus, Activity, Target, Calendar, BarChart3, LineChart, Sparkles, Lightbulb, TrendingUp as TrendingUpIcon, Users, Award, Clock, Target as TargetIcon } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, ComposedChart, Bar } from 'recharts';
import { useWellness } from '../contexts/WellnessContext';
import { useGuest } from '../contexts/GuestContext';
import { useAuth } from '../contexts/AuthContext';
import { SkeletonLoader } from './SkeletonLoader';
import { PullToRefresh } from './PullToRefresh';
import { geminiService } from '../services/geminiApi';

const timeRanges = [
  { id: 'daily', label: 'Daily', icon: Calendar },
  { id: 'weekly', label: 'Weekly', icon: BarChart3 },
  { id: 'monthly', label: 'Monthly', icon: LineChart }
];

const createGuestAnalytics = (isNewUser = false) => {
  const today = new Date();
  const data = [];
  
  // For new users, return empty data to avoid spoiling the experience with random data
  if (isNewUser) {
    return [];
  }
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: Math.floor(Math.random() * 4) + 6,
      energy: Math.floor(Math.random() * 3) + 6,
      sleep: Math.floor(Math.random() * 3) + 7,
      stress: Math.floor(Math.random() * 4) + 3,
      exercise: Math.floor(Math.random() * 60) + 20
    });
  }
  
  return data;
};

const getTimeRangeData = (data: any[] | undefined, range: string) => {
  if (!data || data.length === 0) {
    return [];
  }
  
  if (range === 'daily') {
    return data.slice(-7); // Last 7 days
  } else if (range === 'weekly') {
    return data.slice(-14); // Last 14 days
  } else {
    return data.slice(-30); // Last 30 days
  }
};

export const Dashboard: React.FC = () => {
  const { getAnalytics, entries } = useWellness();
  const { isGuestMode, guestEntries } = useGuest();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('daily');
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  console.log('Dashboard: Component rendered with props:', {
    hasGetAnalytics: !!getAnalytics,
    entriesCount: entries?.length,
    isGuestMode,
    user: user ? { id: user.id, email: user.email } : null
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('Dashboard: Loading data, user:', user, 'isGuestMode:', isGuestMode);
        console.log('Dashboard: Guest entries:', guestEntries);
        
        if (isGuestMode) {
          // Check if this is a new guest user (no entries yet)
          const isNewUser = !guestEntries || guestEntries.length === 0;
          console.log('Dashboard: Using guest data, isNewUser:', isNewUser);
          
          // Create appropriate data based on whether user is new
          const guestData = createGuestAnalytics(isNewUser);
          console.log('Dashboard: Guest data created:', guestData);
          
          // For new users, show zero data
          if (isNewUser) {
            const newUserData = {
              entries: [],
              summary: {
                averageMood: 0,
                averageEnergy: 0,
                averageSleep: 0,
                averageStress: 0,
                totalEntries: 0
              }
            };
            console.log('Dashboard: Setting new user data:', newUserData);
            setAnalytics(newUserData);
          } else {
            // For returning guest users, show sample data
            const returningUserData = {
              entries: guestData,
              summary: {
                averageMood: 7.2,
                averageEnergy: 6.8,
                averageSleep: 7.5,
                averageStress: 4.2,
                totalEntries: guestData.length
              }
            };
            console.log('Dashboard: Setting returning user data:', returningUserData);
            setAnalytics(returningUserData);
          }
        } else {
          // Use real data
          console.log('Dashboard: Fetching real analytics for user:', user?.id);
          if (!user) {
            console.error('Dashboard: No user found');
            throw new Error('User not authenticated');
          }
          
          // Check if this is a new authenticated user (no entries yet)
          const isNewUser = !entries || entries.length === 0;
          
          if (isNewUser) {
            // For new authenticated users, show zero data
            setAnalytics({
              entries: [],
              summary: {
                averageMood: 0,
                averageEnergy: 0,
                averageSleep: 0,
                averageStress: 0,
                totalEntries: 0
              }
            });
          } else {
            // For returning authenticated users, fetch their data
            const data = await getAnalytics();
            console.log('Dashboard: Analytics data received:', data);
            setAnalytics(data);
          }
        }
      } catch (error) {
        console.error('Dashboard: Error loading analytics:', error);
        // Show empty data instead of random data on error
        setAnalytics({
          entries: [],
          summary: {
            averageMood: 0,
            averageEnergy: 0,
            averageSleep: 0,
            averageStress: 0,
            totalEntries: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    console.log('Dashboard: useEffect triggered with dependencies:', { getAnalytics, isGuestMode, user });
    loadData();
  }, [getAnalytics, isGuestMode, user]);

  useEffect(() => {
    const generateAIRecommendations = async () => {
      if (!analytics || !analytics.entries || analytics.entries.length === 0) {
        setAiRecommendations('Start tracking your wellness to receive personalized recommendations.');
        return;
      }
      
      setAiLoading(true);
      try {
        const recentData = analytics.entries.slice(-7);
        const prompt = `Based on this wellness data: ${JSON.stringify(recentData)}, provide 3 personalized wellness recommendations. Focus on mood, energy, sleep, and stress management. Keep each recommendation under 100 words.`;
        
        const response = await geminiService.generateResponse(prompt);
        setAiRecommendations(response);
      } catch (error) {
        console.error('Error generating AI recommendations:', error);
        setAiRecommendations('Unable to generate recommendations at this time.');
      } finally {
        setAiLoading(false);
      }
    };

    generateAIRecommendations();
  }, [analytics]);

  console.log('Dashboard: Current state:', { loading, analytics: !!analytics });

  if (loading) {
    console.log('Dashboard: Showing loading spinner');
    return <SkeletonLoader />;
  }

  console.log('Dashboard: Rendering dashboard content');

  const currentData = analytics && analytics.entries ? getTimeRangeData(analytics.entries, timeRange) : [];
  const summary = analytics?.summary || {
    averageMood: 0,
    averageEnergy: 0,
    averageSleep: 0,
    averageStress: 0,
    totalEntries: 0
  };

  // Log the summary values to debug
  console.log('Dashboard metrics summary:', {
    averageMood: summary?.averageMood,
    averageEnergy: summary?.averageEnergy,
    averageSleep: summary?.averageSleep,
    averageStress: summary?.averageStress,
    totalEntries: summary?.totalEntries
  });

  const metrics = [
    {
      name: 'Mood',
      value: summary?.averageMood === 0 || summary?.averageMood === undefined ? 'No data' : summary.averageMood,
      icon: Heart,
      color: 'from-pink-500 to-red-500',
      trend: 'up',
      change: '+0.3'
    },
    {
      name: 'Energy',
      value: summary?.averageEnergy === 0 || summary?.averageEnergy === undefined ? 'No data' : summary.averageEnergy,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      trend: 'up',
      change: '+0.2'
    },
    {
      name: 'Sleep',
      value: summary?.averageSleep === 0 || summary?.averageSleep === undefined ? 'No data' : summary.averageSleep,
      icon: Moon,
      color: 'from-indigo-500 to-purple-500',
      trend: 'down',
      change: '-0.1'
    },
    {
      name: 'Stress',
      value: summary?.averageStress === 0 || summary?.averageStress === undefined ? 'No data' : summary.averageStress,
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      trend: 'up',
      change: '+0.1'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          Wellness Dashboard
        </h1>
        <p className="text-gray-300 text-lg">
          {isGuestMode ? 'Guest Mode - Your wellness insights' : 'Track your wellness journey'}
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
          {timeRanges.map((range) => {
            const Icon = range.icon;
            return (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  timeRange === range.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{range.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
          <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  {summary?.totalEntries === 0 ? (
                    <span className="text-sm text-gray-400">New user</span>
                  ) : metric.trend === 'up' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-green-400">{metric.change}</span>
                    </>
                  ) : metric.trend === 'down' ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-red-400">{metric.change}</span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-400">{metric.change}</span>
                    </>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {typeof metric.value === 'string' ? metric.value : metric.value?.toFixed(1) || 'N/A'}
              </h3>
              <p className="text-gray-300">{metric.name}</p>
              <p className="text-xs text-gray-400">Debug: {JSON.stringify(metric.value)}</p>
              </motion.div>
          );
        })}
      </div>

      {/* Wellness Insights Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Wellness Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">AI-Powered Recommendations</h3>
            </div>
            {aiLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-white/20 rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
                <p className="text-gray-200 whitespace-pre-line">{aiRecommendations || 'No recommendations available yet.'}</p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TargetIcon className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Streak</span>
                </div>
                <p className="text-2xl font-bold text-blue-200">
                  {summary?.totalEntries === 0 ? 'You are new' : `${summary?.totalEntries} days`}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">Best Day</span>
                </div>
                <p className="text-2xl font-bold text-green-200">
                  {summary?.totalEntries === 0 ? 'No data yet' : '8.5'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-3">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Wellness Trends</h2>
        </div>
        
        {currentData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.7)"
              fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                  domain={[0, 10]}
                />
            <Tooltip 
              contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                    color: 'white'
                  }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#ec4899" 
                  strokeWidth={3}
              dot={{ fill: '#ec4899', strokeWidth: 2, r: 4 }}
              name="Mood"
            />
            <Line 
              type="monotone" 
              dataKey="energy" 
              stroke="#f59e0b" 
                  strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              name="Energy"
            />
                <Area 
              type="monotone" 
              dataKey="sleep" 
                  fill="rgba(99, 102, 241, 0.3)" 
                  stroke="#6366f1" 
              strokeWidth={2}
                  name="Sleep"
            />
                <Bar 
              dataKey="stress" 
                  fill="rgba(59, 130, 246, 0.7)" 
                  radius={[4, 4, 0, 0]}
                  name="Stress"
                />
              </ComposedChart>
        </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No data yet</h3>
            <p className="text-gray-300">
              {isGuestMode 
                ? 'Complete your first check-in to see your wellness insights!' 
                : 'Start tracking your wellness to see insights here.'
              }
            </p>
              </div>
        )}
      </div>
    </div>
  );
};