import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Heart, Zap, Moon, Brain, Activity, TrendingUp, Target, Users, Shield } from 'lucide-react';

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  firstName: yup.string().when('mode', {
    is: 'register',
    then: (schema) => schema.required('First name is required'),
    otherwise: (schema) => schema.optional(),
  }),
  lastName: yup.string().when('mode', {
    is: 'register',
    then: (schema) => schema.required('Last name is required'),
    otherwise: (schema) => schema.optional(),
  }),
}).required();

type FormData = yup.InferType<typeof schema>;

interface AuthFormProps {
  onBack?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    context: { mode },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('AuthForm: Attempting', mode, 'with data:', { email: data.email, firstName: data.firstName, lastName: data.lastName });
      
      if (mode === 'login') {
        await login(data.email, data.password);
        console.log('AuthForm: Login successful');
      } else {
        await register(data.email, data.password, data.firstName!, data.lastName!);
        console.log('AuthForm: Registration successful');
      }
    } catch (error) {
      console.error('AuthForm: Error during', mode, ':', error);
      setError(error instanceof Error ? error.message : `Failed to ${mode}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl">
        {/* Website Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-xl border border-white/20 hidden lg:block"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">WellNest</span>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Your Wellness Journey Starts Here
          </h2>
          
          <p className="text-lg text-pink-100 mb-8 leading-relaxed">
            Track your mood, energy, sleep, and stress with AI-powered insights.
            Discover patterns, set goals, and improve your overall well-being.
          </p>
          
          <h3 className="text-xl font-bold text-white mb-4">Key Features</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">Mood Tracking</h4>
                <p className="text-pink-100 text-sm">Track your daily mood and emotional well-being</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">Energy Monitoring</h4>
                <p className="text-pink-100 text-sm">Monitor your energy levels throughout the day</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Moon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">Sleep Analysis</h4>
                <p className="text-pink-100 text-sm">Track sleep quality and duration</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">Stress Management</h4>
                <p className="text-pink-100 text-sm">Monitor stress levels with personalized recommendations</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-4">Why Choose WellNest?</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
              <p className="text-pink-100 text-sm">Track progress with beautiful charts</p>
            </div>
            
            <div className="flex items-start space-x-2">
              <Target className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
              <p className="text-pink-100 text-sm">Set personalized wellness goals</p>
            </div>
            
            <div className="flex items-start space-x-2">
              <Users className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
              <p className="text-pink-100 text-sm">Connect with community support</p>
            </div>
            
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
              <p className="text-pink-100 text-sm">Privacy-first approach to your data</p>
            </div>
          </div>
        </motion.div>
        
        {/* Auth Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20"
        >
        {/* Header */}
        <div className="text-center mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join WellNest'}
          </h1>
          <p className="text-gray-300">
            {mode === 'login' 
              ? 'Sign in to continue your wellness journey' 
              : 'Create your account to start tracking your wellness'
            }
          </p>
        </div>
        
        {/* Mobile Website Information (visible only on small screens) */}
        <div className="lg:hidden mb-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3">WellNest Features:</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-pink-100 text-sm">Mood Tracking</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-pink-100 text-sm">Energy Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-pink-100 text-sm">Sleep Analysis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-pink-100 text-sm">Stress Management</span>
              </div>
            </div>
            <p className="text-xs text-pink-100 italic">Track your wellness journey with AI-powered insights</p>
          </div>
        </div>



        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-6"
          >
            <p className="text-red-200 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...registerField('firstName')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-300 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    {...registerField('lastName')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-300 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                {...registerField('email')}
                type="email"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-300 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                {...registerField('password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </motion.button>
        </form>

        {/* Mode Toggle */}
        <div className="text-center mt-6">
          <p className="text-gray-300">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="ml-1 text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );
};